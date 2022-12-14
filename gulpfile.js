const gulp = require('gulp');
const { series } = require('gulp');
const clean = require('gulp-rimraf');
const historyApiFallback = require('connect-history-api-fallback');
const rename = require('gulp-rename');
const browserify = require('browserify');
const babelify = require('babelify');
const tsify = require('tsify');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const handlebars = require('gulp-compile-handlebars');
const uglify = require('gulp-uglify');
const fs = require('fs');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

// Copy html files
async function compileHandlebars() {
    options = {
        batch: [
            './src/views/pages',
            './src/views/modules',
            './src/views/modules/components'
        ]
    };

    fs.readFile('./data.json', 'utf-8', (error, content) => {
        if (error) throw error;
        if (content != '') {
            return gulp
                .src('./src/views/pages/index.hbs')
                .pipe(handlebars(JSON.parse(content), options))
                .pipe(rename('index.html'))
                .pipe(gulp.dest('dist'));
        }
        content = fs.readFileSync('./data.json', 'utf-8');
        return gulp
            .src('./src/views/pages/index.hbs')
            .pipe(handlebars(JSON.parse(content)))
            .pipe(rename('index.html'))
            .pipe(gulp.dest('dist'));

    });
}

// Clear dist folder
function clear() {
    console.log('Cleaning build folder...');
    return gulp.src('dist/*', { read: false }).pipe(clean());
}

function promisifyStream(stream) {
    return new Promise(resolve => stream.on('end', resolve));
}

async function copyPages() {
    const paths = ['about', 'contact', 'info', 'view', '404'];
    const dataFiles = paths.map(t => `${t === '404' ? t : `data-${t}`}`);

    await Promise.all(
        dataFiles.map(file => {
            let data;
            try {
                if (file === '404') {
                    return promisifyStream(
                        gulp
                            .src('./src/views/pages/404.hbs')
                            .pipe(handlebars({}))
                            .pipe(rename('404.html'))
                            .pipe(gulp.dest('dist'))
                    );
                }

                data = JSON.parse(fs.readFileSync(`./${file}.json`, 'utf8'));
            } catch (err) {
                return null;
            }

            const distFile = `${file.replace(/data-?/, '')}.html`;

            return promisifyStream(
                gulp
                    .src(`./src/views/pages/${file.replace(/data-?/, '')}.hbs`)
                    .pipe(handlebars(data, options))
                    .pipe(rename(distFile))
                    .pipe(gulp.dest('dist'))
            );
        })
    );
}
// Minify images NOT WORKING
/* gulp.task('imageMinify', async () => {
    return gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
}); */

// Compile sass styles to css
function styles() {
    return gulp
        .src('src/sass/main.scss')
        .pipe(sass())
        .pipe(rename('styles.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
}

// Watch for file changes
function watch() {
    browserSync.init({
        server: {
            baseDir: './dist',
            middleware: [historyApiFallback()]
        }
    });
    gulp.watch('src/sass/*.scss', styles);
    gulp.watch('src/ts/**/*.ts').on('change', tsCompile);
    gulp.watch('src/js/*.js').on('change', series(jsCopy));
    gulp.watch('./data.json').on('change', compileHandlebars);
    gulp.watch('src/views/**/*.hbs').on(
        'change',
        series(compileHandlebars, copyPages)
    );
    gulp.watch('dist/*.html').on('change', browserSync.reload);
    gulp.watch('dist/js/*.js').on('change', browserSync.reload);
}

function images() {
    return gulp.src('src/media/**/*').pipe(gulp.dest('./dist/media'));
}

function copyPublicAssets() {
    return gulp.src('public/*').pipe(gulp.dest('./dist/public'));
}

// Copy fonts to 'dist' folder
function fonts() {
    return gulp.src('src/fonts/**/*').pipe(gulp.dest('dist/fonts'));
}

// Copy js libraries
function jsCopy() {
    return gulp.src('src/js/*').pipe(gulp.dest('dist/js'));
}

// Copy favicon files
function copyFavicons() {
    return gulp.src('src/media/favicons/*').pipe(gulp.dest('dist/favicons'));
}

// Create Javascript bundle from TypeScript sourcefiles
function tsCompile() {
    const bundler = browserify({
        entries: './src/ts/Main.ts',
        debug: true,
        plugin: tsify
    });

    return bundler
        .transform(babelify, {
            presets: ['@babel/preset-env'],
            extensions: ['.js', '.ts'],
            global: true
        })
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./dist/js'));
}

exports.watch = series(
    clear,
    copyFavicons,
    tsCompile,
    compileHandlebars,
    copyPages,
    styles,
    fonts,
    images,
    copyPublicAssets,
    watch
);
exports.build = series(
    clear,
    copyFavicons,
    tsCompile,
    compileHandlebars,
    copyPages,
    styles,
    fonts,
    images,
    copyPublicAssets,
);
exports.clear = clear;
