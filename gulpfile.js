
var argv = require('yargs').argv
var gulp = require('gulp')
var gulpif     = require('gulp-if')
var uglify     = require('gulp-uglify')

var sourcemaps = require('gulp-sourcemaps')
var notify = require('gulp-notify')
var gulpWatch = require('gulp-watch')
var less = require('gulp-less')
var minifyCSS  = require('gulp-cssnano');

var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var babel = require('gulp-babel')
var browserify = require('browserify')
var watchify = require('watchify')
var babelify = require('babelify')

var combiner = require('stream-combiner2')

var production = false
var vendors = [
  'react',
  'react-router',
  'react-dom',
  'request',
  'joi'
]

gulp.task('vendors', function () {
    var stream = browserify({
            debug: !production,
            require: vendors
        })
    .bundle()
    .pipe(source('vendors.js'))
    .pipe(buffer())
    .pipe(babel({presets:['es2015-without-strict']}))
     .pipe(uglify())
    .pipe(gulp.dest('public/js'))

    return stream
})


function compile(watch) {
	var bundler = browserify('./public/app/index.js', { 
		debug: !production,
		cache:{},
		packageCache:{}
	})
	if (watch)
		bundler = watchify(bundler)

	vendors.forEach(function(vendor) {
        bundler.external(vendor);
    })
	bundler.transform("babelify", {presets: ["es2015", "react"]})
   	
	function rebundle() {
		var bundle = [bundler.bundle(),
			source('app.js'),
			buffer()]
		var prod = []
		if (production)
			prod.push(uglify())
		var combined = combiner.obj(bundle.concat(prod,[gulp.dest('./public/js'),notify('JSX Compiled Minified')]))
		combined.on('error', function(err) {
			console.error(err)
			this.emit('end')
		})
		return combined
	}

	if (watch) {
		bundler.on('update', function() {
			console.log('-> bundling...')
			rebundle()
		})
	}

	return rebundle()
}

function watch() {
	return compile(true)
}

var cssMainFile     = 'public/less/style.less'
var cssFiles        = 'public/less/**/*.less'


gulp.task('css', function(){
    return gulp.src(cssMainFile)
        .pipe(less())
        .pipe(gulpif(argv.production, minifyCSS({keepBreaks:true})))
        .pipe(gulp.dest('./public/less'))
        .pipe(notify('Less Done'))
});

gulp.task('csswatch', function () {
    gulp.watch(cssFiles, ['css']);
});


gulp.task('build', function() { return compile() })

gulp.task('prod',['vendors','buildProd'])
gulp.task('buildProd', ()=> { 
	production = true 
	return compile()
})
gulp.task('watch', function() {	return watch() })

gulp.task('default', ['watch', 'csswatch', 'css'])


