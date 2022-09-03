export default class Utils {
    /**
     * Utility function to be used only
     * on arrays of objects to determine
     * whether an array contains an object
     * with given property.
     * @param {any[]} array - The array to test against.
     * @param {object} obj - The object of which inclusion we are testing.
     * @param {string} array - Property we want to test against.
     */
    public static isArrayRedundant = (
        array: any[],
        obj: object,
        prop: string
    ): boolean => {
        return array.filter((el) => el[prop] === obj[prop]).length > 0;
    };
}
