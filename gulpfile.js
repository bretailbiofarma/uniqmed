const _pathSrc = "src/";
const _pathBuild = "build/";

const gulp = require("gulp");
const { src, dest, task, watch, parallel } = require("gulp");

const browserSync = require("browser-sync").create();
const fs = require("fs");
const path = require("path");

const ftp = require("vinyl-ftp");

const uglify = require("gulp-uglify-es").default;
const babel = require("gulp-babel");

const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");

const posthtml = require("gulp-posthtml");
const htmlnano = require("htmlnano");
const minifyClassnames = require("posthtml-minify-classnames");
const postHTMLNoRef = require("posthtml-link-noreferrer");
const posthtmlInlineAssets = require("posthtml-inline-assets");
const styleToFile = require("posthtml-style-to-file");
const inlinesource = require("gulp-inline-source");
// const validate = require("posthtml-w3c");

const posthtmlPlugins = [
  postHTMLNoRef({
    attr: ["noopener", "noreferrer"],
  }),
  // validate(),
  minifyClassnames({ genNameId: false, customAttributes: [".js-"] }, [
    posthtmlInlineAssets(),
  ]),
  styleToFile({
    removeStyle: "all",
    path: _pathBuild + "css/styles.css",
  }),
  htmlnano(),
];

const deleteFolderRecursive = function(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file, index) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(directoryPath);
  }
};

task("html", () => {
  return src(_pathSrc + "**/*.html")
    .pipe(
      inlinesource({
        compress: false,
        rootpath: _pathBuild,
      })
    )
    .pipe(posthtml(posthtmlPlugins, {}))
    .pipe(dest(_pathBuild));
});

task("js", async () => {
  const jsSrc = `${_pathSrc}/js/**/*.js`;
  const jsBuild = `${_pathBuild}/js`;

  return src(jsSrc)
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(uglify())
    .pipe(dest(jsBuild));
});

task("scss", () => {
  const stylesSrc = `${_pathSrc}/scss/**/*.scss`;
  const stylesBuild = `${_pathBuild}/css`;

  return src(stylesSrc)
    .pipe(
      sass({
        outputStyle: "compressed",
      })
    )
    .pipe(postcss([autoprefixer]))
    .pipe(dest(stylesBuild))
    .on("error", () => {
      console.log("SCSS error");
    });
});

task("img", () => {
  const imgSrc = `${_pathSrc}/img/**/*`;
  const imgBuild = `${_pathBuild}/img/`;

  return src(imgSrc).pipe(dest(imgBuild));
});

task("fonts", () => {
  const fontsSrc = `${_pathSrc}/fonts/**/*`;
  const fontsBuild = `${_pathBuild}/fonts/`;

  return src(fontsSrc).pipe(dest(fontsBuild));
});

task("empty", async () => {
  deleteFolderRecursive(_pathBuild);

  return true;
});

gulp.task("watch", function() {
  browserSync.init({
    server: _pathBuild,
  });

  gulp
    .watch(
      _pathSrc + "**/*.scss",
      gulp.parallel(() => {
        return src(_pathSrc + "scss/**/*.scss")
          .pipe(sass({}))
          .pipe(postcss([autoprefixer]))
          .pipe(dest(_pathBuild + "css"));
      })
    )
    .on("change", browserSync.reload);

  gulp
    .watch(
      _pathSrc + "js/**/*.js",
      gulp.parallel(() => {
        return src(`${_pathSrc}/js/**/*.js`)
          .pipe(
            babel({
              presets: ["@babel/env"],
            })
          )
          .pipe(dest(`${_pathBuild}/js`));
      })
    )
    .on("change", browserSync.reload);

  gulp
    .watch(
      _pathSrc + "img/**/*",
      gulp.parallel(() => {
        return src(`${_pathSrc}/img/**/*`).pipe(dest(`${_pathBuild}/img`));
      })
    )
    .on("change", browserSync.reload);

  gulp
    .watch(
      _pathSrc + "**/*.html",
      gulp.parallel(() => {
        return src(`${_pathSrc}**/*.html`)
          .pipe(
            posthtml([
              postHTMLNoRef({
                attr: ["noopener", "noreferrer"],
              }),
            ])
          )
          .pipe(dest(_pathBuild));
      })
    )
    .on("change", browserSync.reload);
});

task("prod", () => {
  const ftpSettings = require("ftp-settings");
  const connect = ftp.create(ftpSettings);

  return src(`${_pathBuild}/**/*.*`)
    .pipe(connect.newer("www/bretail.ru/"))
    .pipe(connect.dest("www/bretail.ru/"))
    .on("success", () => console.log(`Success deploy`))
    .on("error", (e) => console.log(`Failed deploing: ${e}`));
});
