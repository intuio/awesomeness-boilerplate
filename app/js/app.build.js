({
    appDir: "../",
    baseUrl: "js/",
    dir: "../../the-build",
    mainConfigFile: 'common.js',
    //Comment out the optimize line if you want
    //the code minified by UglifyJS
    //optimize: "none",

    modules: [
        //Optimize the application files. jQuery is not 
        //included since it is already in require-jquery.js
        {
            name: "common"
        },

        {
            name: "main-accordion",

            exclude: ["common"]
        },
        
        {
            name: "main-buttons",

            exclude: ["common"]
        },
        
        {
            name: "main-tabs",

            exclude: ["common"]
        },
        
        {
            name: "main-slider",

            exclude: ["common"]
        }
    ]
})
