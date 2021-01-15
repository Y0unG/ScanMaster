
let project_folder="dist";
let source_folder="public";

let path={
    build:{
        html:project_folder+"/",
        css:project_folder+"/css",
        js:project_folder+"/js",
        img:project_folder+"/img",
        fonts:project_folder+"/fonts",
    },
    src:{
        html:[source_folder+"/*.html", "!" + source_folder+"/_*.html"],
        css:source_folder+"/scss/style.scss",
        js:source_folder+"/js/script.js",
        img:source_folder+"/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts:source_folder+"/fonts/*.ttf",
    },
    watch:{
        html:source_folder+"/**/*.html",
        css:source_folder+"/scss/**/*.scss",
        js:source_folder+"/js/**/.js",
        img:source_folder+"/img/**/*.{jpg,png,svg,gif,ico,webp}"
    },
    clean:"./"+project_folder +"/"
}

let {src, dest} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require("browser-sync").create(),
    fileinclude = require("gulp-file-include"),
    scss = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    cleanCss = require("gulp-clean-css"),
    uglifyjs = require("gulp-uglify-es").default,
    imagemin = require("gulp-imagemin")

function browserSync(params) {
    browsersync.init({
        server:{
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: true
    })
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(scss({}))
        .pipe(autoprefixer({
            overrideBrowserslist: ["last 5 versions"],
            cascade: true
        }))
        .pipe(cleanCss())
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(
            uglifyjs({})
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function images() {
    return src(path.src.img)
        .pipe(
            imagemin({
                progressive: true,
                interlaced:true,
                optimizationLevel: 3
                })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

let build = gulp.series(gulp.parallel(js, css, html,  images));
let watch = gulp.parallel(build,  watchFiles, browserSync);

exports.images=images;
exports.js = js;
exports.css=css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;