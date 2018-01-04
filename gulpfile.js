var gulp = require('gulp'),
	sass = require('gulp-sass'),
    less = require('gulp-less'),
    cleancss = require('gulp-clean-css'),
	uglify = require('gulp-uglify'),
	header = require('gulp-header'),
	notify = require('gulp-notify'),
	plumber = require('gulp-plumber'),
	livereload = require('gulp-livereload'),
	connect = require('gulp-connect');

var pkg = require('./package.json'),
	notes = ['/**',
	  ' * @author <%= pkg.author.name %>',
	  ' * @email <%= pkg.author.email %>',
	  ' * @descrip <%= pkg.description %>',
	  ' * @version v<%= pkg.version %>',
	  ' */',
	  ''].join('\n');

gulp.task('sass', function() {
	return gulp.src('dev/static/style/**/*.scss')
			.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
			.pipe(sass())
			.pipe(cleancss())
			.pipe(header(notes, { pkg : pkg } ))
			.pipe(gulp.dest('build/static/style'))
			.pipe(livereload());
});
gulp.task('less', function() {
    return gulp.src('dev/static/style/*.less')
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(less())
        .pipe(cleancss())
        .pipe(header(notes, { pkg : pkg } ))
        .pipe(gulp.dest('build/static/style'))
        .pipe(livereload());
});

gulp.task('css', function(){
	return gulp.src('dev/static/**/*.css')
			.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
			.pipe(cleancss())
			.pipe(gulp.dest('build/static'))
			.pipe(livereload());
});

gulp.task('uglifyjs', function() {
	return gulp.src(['dev/static/script/**/*.js', '!dev/static/script/**/*.min.js'])
			.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
			.pipe(uglify({
				mangle: {except: ['require' ,'exports' ,'module' ,'$']}
			}))
			.pipe(header(notes, { pkg : pkg } ))
			.pipe(gulp.dest('build/static/script'))
			.pipe(livereload());
});

gulp.task('js', function(){
	return gulp.src('dev/static/script/**/*.min.js')
			.pipe(gulp.dest('build/static/script'))
			.pipe(livereload());
});
gulp.task('json', function(){
    return gulp.src('dev/static/script/**/*.json')
        .pipe(gulp.dest('build/static/script'))
        .pipe(livereload());
});

gulp.task('images', function(){
	return gulp.src('dev/static/image/**/*.{png,jpg,gif,svg,ico}')
			.pipe(gulp.dest('build/static/image'))
			.pipe(livereload());
});

gulp.task('html', function(){
	return gulp.src('dev/webapp/**/*')
			.pipe(gulp.dest('build/webapp'))
			.pipe(livereload());
});

gulp.task('change', function() {
    gulp.src([
    	'dev/webapp/**/*.html',
    	'dev/static/style/**/*.scss',
        'dev/static/style/**/*.less',
    	'dev/static/image/**/*.{png,jpg,gif,svg,ico}',
    	'dev/static/script/**/*.js'
    	])
        .pipe(connect.reload());
});

gulp.task('webserver', function() {
    connect.server({
    	host: '',
    	port: 9999,
    	root: './',
    	livereload: true
    });
});

gulp.task('watch', function() {
    gulp.watch('dev/static/style/**/*.scss', ['sass']);
    gulp.watch('dev/static/style/**/*.less', ['less']);
    gulp.watch('dev/static/**/*.css', ['css']);
    gulp.watch(['dev/static/script/**/*.js', '!dev/static/script/**/*.min.js'], ['uglifyjs']);
    gulp.watch('dev/static/script/**/*.min.js', ['js']);
    gulp.watch('dev/static/image/**/*.{png,jpg,gif,svg,ico}', ['images']);
    gulp.watch('dev/webapp/**/*', ['html']);
    gulp.watch([
    	'dev/webapp/**/*.html',
    	'dev/static/style/**/*.less',
    	'dev/static/image/**/*.{png,jpg,gif,svg,ico}',
    	'dev/static/script/**/*.js'
    	], ['change']);
});

gulp.task('server', ['sass', 'less', 'css', 'uglifyjs', 'js', 'json', 'images', 'html', 'webserver', 'watch']);
