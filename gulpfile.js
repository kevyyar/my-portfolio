const { series, src, dest, watch } = require("gulp");
const sass = require("gulp-dart-sass");
const imagemin = require("gulp-imagemin");
const notify = require("gulp-notify");
const webp = require("gulp-webp");
const concat = require("gulp-concat");
const browsersync = require('browser-sync').create();

// CSS Utilities
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
// JS Utilities
const terser = require('gulp-terser-js');



const paths = {
	scss: "./src/scss/**/*.scss",
	images: "./src/img/**/*",
	js: "./src/js/**/*.js",
};

// Compila CSS
function css() {
	return src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest("./build/css"));
}

// minificar css
// function minifyCss() {
// 	return src(paths.scss)
// 		.pipe(
// 			sass({
// 				outputStyle: "compressed",
// 			})
// 		)
// 		.pipe(dest("./build/css"));
// }

// load javascript
function javascript() {
	return src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(concat("bundle.js"))
    .pipe(terser() )
    .pipe(sourcemaps.write('.'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest("./build/js"));
}

// browser hot reload
function browsersyncServe(cb) {
    browsersync.init({
        server: {
            baseDir: '.'
        }
    });
    cb();
}

function browsersyncReload(cb) {
    browsersync.reload();
    cb();
}

// watch changes in files
function watchFiles() {
    watch('*.html', browsersyncReload);
    watch([paths.scss, paths.js], series(css, javascript, browsersyncReload));
}

// compresss images
function compressImages() {
	return src(paths.images)
		.pipe(imagemin())
		.pipe(dest("./build/img"))
		.pipe(notify({ message: "modified images" }));
}

// tranform images to Webp format
function webpVersion() {
	return src(paths.images)
		.pipe(webp())
		.pipe(dest("./build/img"))
		.pipe(notify({ message: "webp version is ready" }));
}
exports.css = css;
exports.javascript = javascript;
// exports.minifyCss = minifyCss;
exports.compressImages = compressImages;
exports.watchFiles = watchFiles;

exports.default = series(
	css,
	javascript,
	compressImages,
	webpVersion,
    browsersyncServe,
	watchFiles
);
