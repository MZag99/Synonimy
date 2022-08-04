const gulp = require('gulp'),
    { series } = require('gulp'),
    clean = require('gulp-rimraf'),
    rename = require('gulp-rename'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    tsify = require('tsify'),
    sass = require('gulp-sass')(require('sass')),
    browserSync = require('browser-sync').create(),
    handlebars = require('gulp-compile-handlebars'),
    uglify = require('gulp-uglify'),
    fs = require('fs'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer');

// Copy html files
async function compileHandlebars() {
    options = {
        batch: [
            './src/views/layouts',
            './src/views/modules',
            './src/views/modules/components'
        ]
    };

    fs.readFile('./data.json', 'utf-8', (error, content) => {
        if (error) throw error;
        if (content != '') {
            return gulp
                .src('./src/views/layouts/index.hbs')
                .pipe(handlebars(JSON.parse(content), options))
                .pipe(rename('index.html'))
                .pipe(gulp.dest('dist'));
        } else {
            content = fs.readFileSync('./data.json', 'utf-8');
            return gulp
                .src('./src/views/layouts/index.hbs')
                .pipe(handlebars(JSON.parse(content)))
                .pipe(rename('index.html'))
                .pipe(gulp.dest('dist'));
        }
    });
}

// Clear dist folder
function clear() {
    console.log('Cleaning build folder...');
    return gulp.src('dist/*', { read: false }).pipe(clean());
}
// Minify images NOT WORKING
/*gulp.task('imageMinify', async () => {
    return gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
});*/

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
            baseDir: './dist'
        }
    });
    gulp.watch('src/sass/*.scss', styles);
    gulp.watch('src/ts/**/*.ts').on('change', tsCompile);
    gulp.watch('src/js/*.js').on('change', series(jsCopy));
    gulp.watch('./data.json').on('change', compileHandlebars);
    gulp.watch('src/views/**/*.hbs').on('change', compileHandlebars);
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

function jsCopy() {
    return gulp.src('src/js/*').pipe(gulp.dest('dist/js'));
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
    tsCompile,
    compileHandlebars,
    styles,
    fonts,
    images,
    copyPublicAssets,
    watch
);
exports.build = series(
    clear,
    tsCompile,
    compileHandlebars,
    styles,
    fonts,
    copyPublicAssets,
    images
);
exports.clear = clear;
