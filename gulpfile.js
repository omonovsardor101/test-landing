const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const spritesmith = require("gulp-spritesmith");
// const rimraf = require('rimraf');
const deleteFile =  require('gulp-delete-file');
const deletingRegexp = /\w*$/;
const gulpIf = require('gulp-if');
const rename = require("gulp-rename");




// Server
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });

    gulp.watch('build/**/*').on('change', browserSync.reload);
});

// Pug compile
gulp.task('templates:compile', function buildHTML() {
    return gulp.src('source/templates/index.pug').pipe(pug({
        pretty: true
    }))
    .pipe(gulp.dest('build'))
});

// Styles compile
gulp.task('sass', function () {
    return gulp.src('source/styles/main.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('build/css'))
});

// Sprite
gulp.task('sprite', function() {
    return  gulp.src('source/img/icons/*.png')
                .pipe(spritesmith({
                    imgName: 'sprite.png',
                    imgPath: '../img/sprite.png',
                    styleName: 'sprite.scss',
                }))
                .pipe(gulpIf('*.png', gulp.dest('build/images/')))
                .pipe(gulpIf('*.css', gulp.dest('build/styles/global')));
    // const spriteData = gulp.src(src/images/icons/cb.png).pipe(spritesmith({
    //     imgName: "sprite.png",
    //     imgPath: "../images/sprite.png",
    //     styleName: "sprite.scss"        
    // }));

    // spriteData.img.pipe(gulp.dest('build/images/'))
    // spriteData.css.pipe(gulp.dest('build/styles/global'))
});

// Delete
gulp.task('clean', function (del) {
    return gulp.src(['build/*.*'], {
        allowEmpty: true
    })
    .pipe(deleteFile({
        reg: deletingRegexp,
        deleteMatch: true
    }))
})

// gulp.task('clean', function del(cb) {
//     return rimraf('./build', cb);
// });


// Copy fonts
gulp.task('copy:fonts', function() {
    return gulp.src('./source/fonts/**/*.*').pipe(gulp.dest('build/fonts'));
});

// Copy images
gulp.task('copy:images', function() {
    return gulp.src('./source/img/**/*.*').pipe(gulp.dest('build/images'));
});

// Copy
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

// Watchers
gulp.task('watch', function() {
    gulp.watch('source/templates/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('sass'));
});

// Default
gulp.task('default', gulp.series('clean', 
    gulp.parallel('templates:compile', 'sass', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
));

