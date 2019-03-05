/*
	功能：将ES6语法转为ES5
 */

let gulp = require('gulp'),
  gulpBabel = require('gulp-babel'),
  gulpSass = require('gulp-sass'),
  gulpAutoprefixer = require('gulp-autoprefixer');

const fs = require('fs');
const path = require('path');
const pkg = require('./package.json');

gulp.task('compile-es', function() {
  return gulp
    .src(['src/**/*.js'])
    .pipe(
      gulpBabel({
        presets: [
          [
            '@babel/env',
            {
              targets: {
                browsers: ['safari>=9', 'android>=5', 'ios>=9'] //可取值：chrome, opera, edge, firefox, safari, ie, ios, android, node, electron.
              },
              modules: 'commonjs', //可取值"amd" | "umd" | "systemjs" | "commonjs" | false, defaults to "commonjs".
              useBuiltIns: false, //使用'babel-polyfill'
              debug: false //这里按server环境来区分是否debug有些欠妥 以后遇到问题再改 @liuxuefeng 20180306
            }
          ]
        ]
        // plugins: ['@babel/transform-runtime']
      })
    )
    .pipe(gulp.dest(`publish/lib`));
});

gulp.task('compile-scss', function() {
  return gulp
    .src('publish/lib/**/*.scss')
    .pipe(
      gulpSass({
        outputStyle: 'expanded'
      })
    )
    .pipe(gulpAutoprefixer())
    .pipe(gulp.dest('publish/lib'));
});

gulp.task('generate-extra-file', function(cb) {
  delete pkg.devDependencies;
  delete pkg.scripts;
  delete pkg['lint-staged'];

  fs.writeFileSync(
    path.resolve(__dirname, './publish/package.json'),
    JSON.stringify(pkg, null, 2)
  );

  fs.copyFileSync('./LICENSE', './publish/LICENSE');
  fs.copyFileSync('./README.md', './publish/README.md');
  cb();
});

gulp.task('build-cjs', gulp.series(['compile-scss', 'compile-es']));