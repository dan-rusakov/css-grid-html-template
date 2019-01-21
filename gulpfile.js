var gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleancss       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		autoprefixer   = require('gulp-autoprefixer'),
		notify         = require("gulp-notify"),
		imagemin      = require('gulp-imagemin'),
		del           = require('del');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		open: false,
		// online: false, // Работа без интернет подключения
		//tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	});
});

gulp.task('js', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/js/common.js', // Всегда в конце
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Минимизировать js
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({outputStyle: 'expanded'}).on("error", notify.onError()))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // закомментировать при отладке
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', gulp.parallel('sass', 'js', 'browser-sync'), function() {
	gulp.watch('app/sass/**/*.sass', gulp.parallel('sass'));
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('js'));
	gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('default', gulp.parallel('watch'));


gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('compress', function() {
  return gulp.src('app/img/**/*')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/img'))
});

gulp.task('build', gulp.parallel('clean', 'compress', 'sass', 'js'), function() {
  var buildCss = gulp.src('app/css/main.min.css')
  .pipe(gulp.dest('dist/css'));

  var buildFonts = gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'));

  var buildJs = gulp.src('app/js/scripts.min.js')
  .pipe(gulp.dest('dist/js'));

  var buildHtml = gulp.src('app/*.html')
  .pipe(gulp.dest('dist'));
});