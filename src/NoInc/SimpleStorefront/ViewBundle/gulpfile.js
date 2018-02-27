// Load plugins
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const cache = require('gulp-cache');
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');
const del = require('del');
const eslint = require('gulp-eslint');
const gutil = require('gulp-util');
const imagemin = require('gulp-imagemin');
const order = require('gulp-order');
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');

const webFolder = '../../../../web/';

gulp.task('vendor-styles', () => {
    return gulp.src([
        'node_modules/angular-material/angular-material.css',
        'node_modules/angular-material-sidemenu/dest/angular-material-sidemenu.css',
        'node_modules/angular-material-data-table/dist/md-data-table.css',
        'node_modules/textangular/dist/textAngular.css'
    ], {base: '.'})
    .pipe(order([
        '**/*.scss',
    ], { base: './' }))
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version'))
    .pipe(concat('noinc-vendor.css'))
    .pipe(cssnano())
    .pipe(rename('pla-vendor.min.css'))
    .pipe(gulp.dest(`${webFolder}/stylesheets`))
});

gulp.task('styles', () => {
    return gulp.src([
        'Resources/src/scss/**/*.scss',
        'Resources/src/scss/**/*.css',
    ], {base: '.'})
    .pipe(order([
        '**/*.scss',
    ], { base: './' }))
    .pipe(sass({ style: 'expanded', zindex: false }))
    .pipe(autoprefixer('last 2 version'))
    .pipe(concat('noinc.css'))
    .pipe(cssnano())
    .pipe(rename('pla.min.css'))
    .pipe(gulp.dest(`${webFolder}/stylesheets`))
});

// Mathjax is a whole thing that requires it's own folder structure
// so rather than concat into one file, we're just going to move the
// whole directory and do ugly loading on the browser side.
gulp.task('mathjax', () => {
    return gulp.src('node_modules/mathjax/**/*', { base: './node_modules' })
    .pipe(gulp.dest(`${webFolder}/scripts`));
});

gulp.task('vendor-scripts', ['mathjax'], () => {
    return gulp.src([
        'node_modules/angular/angular.js',
        'node_modules/@uirouter/angularjs/release/angular-ui-router.js',
        'node_modules/angular-material/angular-material.js',
        'node_modules/angular-animate/angular-animate.js',
        'node_modules/angular-aria/angular-aria.js',
        'node_modules/angular-material-sidemenu/dest/angular-material-sidemenu.js',
        'node_modules/moment/moment.js',
        'node_modules/textangular/dist/textAngular-rangy.min.js',
        'node_modules/textangular/dist/textAngular-sanitize.min.js',
        'node_modules/d3/build/d3.min.js',
        'node_modules/d3-tip/index.js',
        'node_modules/textangular/dist/textAngular.min.js',
        'Resources/src/scripts/vendor-overrides/**/*.js'
    ])
    .pipe(order([
        'node_modules/angular/angular.js',
        'node_modules/@uirouter/angularjs/release/angular-ui-router.js',
        'node_modules/angular-material/angular-material.js',
        'node_modules/angular-animate/angular-animate.js',
        'node_modules/angular-aria/angular-aria.js',
        'node_modules/angular-material-sidemenu/dest/angular-material-sidemenu.js',
        'node_modules/moment/moment.js',
        'node_modules/textangular/dist/textAngular-rangy.min.js',
        'node_modules/textangular/dist/textAngular-sanitize.min.js',
        'node_modules/d3/build/d3.min.js',
        'node_modules/d3-tip/index.js',
        'node_modules/textangular/dist/textAngular.min.js',
        'Resources/src/scripts/vendor-overrides/**/*.js'
    ], { base: './' }))
    .pipe(concat('pla-vendor.js'))
    .pipe(uglify({mangle:false}))
    .pipe(gulp.dest(`${webFolder}/scripts`))
    .pipe(rename({ suffix: '.min' }))
});

gulp.task('scripts', () => {
    return gulp.src(['Resources/src/scripts/**/*.js'])
    .pipe(order([
        'Resources/src/scripts/app.js',
        'Resources/src/scripts/states.js',
        'Resources/src/scripts/utilities.js',
        'Resources/src/scripts/factories/**/*.js',
        'Resources/src/scripts/controllers/**/*.js',
    ]))
    .pipe(eslint({ configFile: '.eslintrc'}))
    // Output a message in the console when checking style
    .on('data', (d) => gutil.log(`JS Checking Style: ${String(d.history[0]).replace('/home/vagrant/flvs/src/NoInc/FLVS/ViewBundle/Resources/src/scripts/', '')}`))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .on('finish', () => gutil.log('JS Checkstyle passed! Thanks :)'))
    .pipe(babel({
        presets: ['es2015'],
        plugins: ['transform-object-rest-spread']
    }))
    .pipe(concat('pla.js'))
    .pipe(uglify({ mangle: false }))
    .pipe(gulp.dest(`${webFolder}/scripts`))
    .pipe(rename({ suffix: '.min' }));
});

gulp.task('views', () => {
    return gulp.src('Resources/src/views/**/*.pug')
    .pipe(pug())
    // This will leave a copy of the plain .html extension file too, but its not hurting anything.
    .pipe(rename({
        extname: ".html.twig"
    }))
    .pipe(gulp.dest('Resources/views'));
});

gulp.task('images', () => {
    return gulp.src(['Resources/src/images/**/*'])
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(`${webFolder}/images`))
});

gulp.task('fonts', () => {
    return gulp.src('Resources/src/fonts/**/*')
    .pipe(gulp.dest(`${webFolder}/fonts`));
});

// Clean
gulp.task('clean', () => {
    return del([`${webFolder}/stylesheets`, `${webFolder}/scripts`, `${webFolder}/images`, `${webFolder}/fonts`, 'Resources/views'], {force: true});
});

// Default task
gulp.task('default', ['clean'], () => {
    gulp.start('styles', 'vendor-styles', 'scripts', 'vendor-scripts', 'fonts', 'images', 'views');
});

// Watch
gulp.task('watch', ['default'], () => {
    // Watch .scss files
    gulp.watch('Resources/src/scss/**/*.{scss, css}', ['styles']);

    gulp.watch('Resources/src/scripts/**/*.js', ['scripts']);

    gulp.watch('Resources/src/fonts/**/*', ['fonts']);

    gulp.watch('Resources/src/views/**/*', ['views']);
});
