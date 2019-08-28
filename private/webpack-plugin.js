const fs = require("fs");
const path = require("path");

class PresetConfigPlugin {
  constructor(options) {
    // String
    this.name = "PresetConfigPlugin";
    /**
     * Object | [ Object ]
     * name: String
     * file: Path
     */
    this.options = options;
    // Boolean
    this.debug = false;

    // 格式化 options
    this.formatedOptions = this.formatOptions(options);
  }

  log(info = "") {
    if (this.debug) console.log(info);
  }

  apply(compiler) {
    const that = this;
    let compilerPlugin = null;
    let compilationPlugin = null;
    const { entryOption, watchRun, compilation } = that;

    if (compiler.hooks) {
      compilerPlugin = function(hooks) {
        for (const hook of Object.entries(hooks)) {
          const hookName = hook[0];
          const hookTap = hook[1].bind(that);
          compiler.hooks[hookName].tap("PresetConfigPlugin", hookTap);
        }
      };

      compilationPlugin = function(compilation, fn) {
        for (const hook of Object.entries(hooks)) {
          const hookName = hook[0];
          const hookTap = fn.bind(that);

          compilation.hooks[hookName].tap("PresetConfigPlugin", hookTap);
        }
      };
    } else {
      compilerPlugin = function(fn) {
        compiler.plugin("emit", fn);
      };
      compilationPlugin = function(compilation, fn) {
        compilation.plugin();
      };
    }

    that.compilerPlugin = compilerPlugin;
    that.compilationPlugin = compilationPlugin;

    compilerPlugin({
      entryOption,
      watchRun,
      compilation
    });
  }

  readFile(files) {
    return files.map(file => {
      const content = fs.readFileSync(file);
      return {
        file,
        content
      };
    });
  }

  formatOptions(options) {
    options = options || this.options;
    // options 仅支持 object | [ object ]
    if (Object.prototype.toString.call(options) === "[object Object]") {
      return [options];
    }

    if (Object.prototype.toString.call(options) === "[object Array]") {
      return options;
    }

    return [];
  }

  resolveOptions() {
    const preset = new Map();
    this.formatedOptions.forEach(option => {
      const { name, file } = option;
      const content = fs.readFileSync(file, "utf-8");
      preset.set(name, content);
    });

    return preset;
  }

  _normalModuleLoader(loaderContext, module) {
    // 给 loaderContext 赋值
    loaderContext.$preset = this.$preset || {};
  }

  entryOption(context, entry) {
    this.log("entryOption");
  }
  afterPlugins(compiler) {
    this.log("afterPlugins");
  }
  afterResolvers(compiler) {
    this.log("afterResolvers");
  }
  environment() {
    this.log("envirnment");
  }
  afterEnvironment() {
    this.log("afterEnvironment");
  }
  beforeRun(compiler) {
    this.log("beforeRun");
  }
  run(compiler) {
    this.log("run");
  }
  watchRun(compiler) {
    this.$preset = this.resolveOptions();
    this.log("watchRun");
  }
  normalModuleFactory(normalModuleFactory) {
    this.log("normalModuleFactory");
  }
  beforeCompile(compilationParams) {
    this.log("beforeCompile");
  }
  compile(compilationParams) {
    this.log("compile");
  }
  thisCompilation(compilation, compilationParams) {
    this.log("thisCompilation");
  }
  compilation(compilation, compilationParams) {
    // 该 hooks 将在v5中遗弃
    compilation.hooks.normalModuleLoader.tap(
      this.name,
      this._normalModuleLoader.bind(this)
    );
    this.log("compilation");
  }
  make(compilation) {
    this.log("make");
  }
  afterCompile(compilation) {
    this.log("afterCompile");
  }
  shouldEmit(compilation) {
    this.log("shouldEmit");
  }
  emit(compilation) {
    this.log("emit");
  }
  afterEmit(compilation) {
    this.log("afterEmit");
  }
  done(stats) {
    this.log("done");
  }
  failed(error) {
    this.log("failed");
  }
  invalid(fileName, changeTime) {
    this.log("invalid");
  }
  watchClose() {
    this.log("afterEmit");
  }
  infrastructureLog(name, type, args) {
    this.log("afterEmit");
  }
  // log (origin, logEntry) { console.log('log') }
}

module.exports = PresetConfigPlugin;
