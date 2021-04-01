// let project_folder = 'dist';
const project_folder = require('path').basename(__dirname);
const source_folder = 'src';

const fs = require('fs');

const env = process.env.NODE_ENV;

const path = {
  src: {
    html: source_folder + '/*.html',
    css: source_folder + '/scss/style.scss',
    js: source_folder + '/js/**/*.js',
    img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}',
    svg: source_folder + '/svg/*.svg',
    fonts: source_folder + '/fonts/*.{eot,woff,woff2,ttf,svg}'
  },
  build: {
    html: project_folder + '/',
    css: project_folder + '/css/',
    js: project_folder + '/js/',
    img: project_folder + '/img/',
    svg: project_folder + '/svg/',
    fonts: project_folder + '/fonts/',
  },
  watch: {
    html: source_folder + '/**/*.html',
    css: source_folder + '/scss/**/*.scss',
    js: source_folder + '/js/**/*.js',
    img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}',
    svg: source_folder + '/svg/',
    fonts: source_folder + '/fonts/*.{eot,woff,woff2,ttf,svg}',
  },
  clean: './' + project_folder + '/'
};

const {
  src,
  dest
} = require('gulp');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const browsersync = require('browser-sync').create();
const panini = require('panini');
const plumber = require("gulp-plumber");
const htmlmin = require('gulp-htmlmin');
const deldist = require('del'); // Удаление диреектории
const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const strip = require('gulp-strip-comments');
const sourcemaps = require('gulp-sourcemaps'); // Для соурсмапов
const group_media = require('gulp-group-css-media-queries'); //Объединение всех медиа запросов
const cleancss = require('gulp-clean-css'); // 
const rename = require('gulp-rename'); // Переименование .min

const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');

const imagemin = require('gulp-imagemin'); // Работа с изображениями
// const webp = require('gulp-webp');
// const webpHTML = require('gulp-webp-html');
// const webpcss = require("gulp-webpcss");

const svgSprite = require('gulp-svg-sprite'), // Создание svg спрайта, удаление атрибутов, минификация
  svgmin = require('gulp-svgmin'),
  replace = require('gulp-replace'),
  cheerio = require('gulp-cheerio');

const ttf2woff = require('gulp-ttf2woff'), // Работа с конвертацией шрифтов
  ttf2woff2 = require('gulp-ttf2woff2'),
  fonter = require('gulp-fonter');


const clean = () => {
  console.log(env);
  return deldist(path.clean);
};

const browserSync = () => {
  browsersync.init({
    server: {
      baseDir: './' + project_folder + '/'
    },
    port: 3000,
    notify: false
  });
};

const html = () => {
  panini.refresh();
  return src(path.src.html, {
      base: source_folder
    })
    .pipe(plumber())
    .pipe(panini({
      root: source_folder,
      layouts: source_folder + '/html/layouts/',
      partials: source_folder + '/html/partials/',
      helpers: source_folder + '/html/helpers/',
      data: source_folder + '/html/data/'
    }))
    /*
    // .pipe(webpHTML())
    */
    .pipe(gulpif(env === 'prod', strip()))
    .pipe(gulpif(env === 'prod', htmlmin({
      collapseWhitespace: true
    })))
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
};

const css = () => {
  return src(path.src.css)
    .pipe(plumber())
    .pipe(gulpif(env === 'dev', sourcemaps.init()))
    .pipe(scss({
      outputStyle: 'expanded'
    }))
    .pipe(gulpif(env === 'prod', group_media()))
    .pipe(gulpif(env === 'prod', autoprefixer(
      ['last 5 versions', '> 1%'], {
        cascade: true
      })))
    /* .pipe(webpcss()) */
    .pipe(gulpif(env === 'prod', cleancss()))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulpif(env === 'dev', sourcemaps.write()))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
};

const js = () => {
  return src(path.src.js)
    .pipe(gulpif(env === 'dev', sourcemaps.init()))
    // .pipe(gulpif(env === 'prod', babel({
    //   presets: ['@babel/env']
    // })))
    // .pipe(dest(path.build.js))
    // .pipe(gulpif(env === 'prod', uglify()))
    .pipe(gulpif(env === 'dev', sourcemaps.write()))
    // .pipe(gulpif(env === 'prod', rename({extname: '.min.js'})))
    // .pipe(rename({extname: '.min.js'}))
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
};

const img = () => {
  return src(path.src.img)
    // .pipe(webp({
    //   quality: 70
    // }))
    // .pipe(dest(path.build.img))
    // .pipe(src(path.src.img))
    .pipe(gulpif(env === 'prod', imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.mozjpeg({
        quality: 75,
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 4
      }),
      imagemin.svgo({
        plugins: [{
            removeViewBox: false
          },
          {
            cleanupIDs: false
          }
        ]
      })
    ])))
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
};

const svg = () => {
  return gulp.src([source_folder + '/svg/*.svg'])
    .pipe(cheerio({
      run: function ($) {
        $("[id]").removeAttr("id");
        $("[fill]").removeAttr("fill");
        $("[clip]").removeAttr("clip");
        $("[stroke]").removeAttr("stroke");
        $("[mask]").removeAttr("mask");
        $("[opacity]").removeAttr("opacity");
        $("[width]").removeAttr("width");
        $("[height]").removeAttr("height");
        $("[class]").removeAttr("class");
        $("[aria-hidden]").removeAttr("aria-hidden");
        $("[data-prefix]").removeAttr("data-prefix");
        $("[data-icon]").removeAttr("data-icon");
        $("[preserveAspectRatio]").removeAttr("preserveAspectRatio");
      },
      parserOptions: {
        xmlMode: true
      }
    }))
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    .pipe(replace('&gt;', '>'))
    .pipe(dest(path.build.svg))
    .pipe(browsersync.stream());
};

const fonts = () => {
  src(path.src.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts));
  return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts));
};

gulp.task('otf2ttf', function () {
  return gulp.src([source_folder + '/fonts/*.otf'])
    .pipe(fonter({
      format: ['ttf']
    }))
    .pipe(dest(source_folder + '/fonts/'));
});


const watchFiles = () => {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.fonts], fonts);
  gulp.watch([path.watch.img], img);
  gulp.watch([path.watch.svg], svg);
};

const build = gulp.series(clean, gulp.parallel(html, css, js, img, svg, fonts));
const watch = gulp.series(build, gulp.parallel(browserSync, watchFiles));

/* Exports Tasks */

exports.fonts = fonts;
exports.clean = clean;
exports.img = img;
exports.svg = svg;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;