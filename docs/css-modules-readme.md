## CSS Modules

A **CSS Module** is a CSS file in which all class names and animation names are scoped locally by default. All URLs (url(...)) and @import are in module request format (./xxx and ../xxx means **relative**, xxx and xxx/yyy means in modules folder, i.e. in **node_modules**).  

CSS Modules compile to a low-level interchange format called ICSS or Interoperable CSS, but are written like normal CSS files:  

When importing the CSS Module from a JS Module, it exports an object with all mappings from local names to global names.  

### Naming

For local class names **cameCase** naming is recommended, but not enforced.  

### Exceptions

**:global** switches to global scope for the current selector respective identifier. :global(.xxx) respective @keyframes:global(xxx) declares the stuff in parenthesis in the global scope.  

Similarly, **:local** and :local(...) for local scope.  

if the selector is switched into global mode, global mode is activated for the rules.(This allows us to make animation:abc; local)  

Example: .localA :global .global-b .global-c :local(.localD.localE) .global-d  

### Composition

It's possible to compose selectors.  

```
.className {
  color: green;
  background: red;
}

.otherClassName {
  composes: className;
  color: yellow;
}
```
There can be multipe composes rules, but composes rules must be before other rules. Extending works only for local-scoped selectors and only if the selector is a single class name. When a class name composes another class name, the CSS Module exports both class names for the local class. This can add up to multiple class names.  

It's possible to compose multiple classes with compose: classNameA classNameB.  

### Dependencies

It's possible to compose class names from other CSS Modules.  

```
.otherClassName {
  composes: className from "./style.css";
}
```

Note that when composing multiple classes from different files the order of appliance is undefined. Make sure to not define different values for the same property in multiple class names from different files when they are composed in a  single class.  

Note that composing should not form a circular dependency. Elsewise it's undefined whether properties of a rule override properties of a composed rule. The module system may emit an error.  

### Usage with preprocessors

**Perprocessors** can make it easy to define a vlock global or local.  
i.e. with less.js  

```
:global {
  .global-class-name {
    color: green;
  }
}
```

### Why?

modular and reusable CSS!  

- No more conflicts.
- Explicit dependencies.
- No global scope. 

### Implementations
#### webpack

Webpack's **css-loader** in module mode replaces every local-scoped identifier with a global unique name (hashed from module name and local identifier by default) and exports the used identifier.  

Extending adds the source class name(s) to the exports.  

Extending from other modules first imports the other module and then adds the class name(s) to the exports.  

#### Server-side and static websites

**PostCSS-Modules** allow to use CSS Modules for static builds and the server side with Ruby, PHP or any other language or framework.  




