# Try Stylus

### Nesting
> selector nesting enables you to keep your styles DRY:

```
body {
  font: 14px/1.5 Helvetica, arial, sans-serif;
#logo {
  border-radius: 5px;
  }
  }

  body {
    font: 14px/1.5 Helvetica, arial, sans-serif;
  }
  body #logo {
    border-radius: 5px;
   }
```

### Flexible syntax
```
body
  font 14px/1.5 Helvetica, arial, sans-serif
  button
  button.button
  input[type='button']
  input[type='submit']
    border-radius 5px
    
body {
  font: 14px/1.5 Helvetica, arial, sans-serif;
}
body button,
body button.button,
body input[type='button'],
body input[type='submit'] {
  border-radius: 5px;
}

```
### Parent reference
```
ul
  li a
    display: block
    color: blue
    padding: 5px
    html.ie &
      padding: 6px
    &:hover
      color: red

ul li a {
  display: block;
  color: #00f;
  padding: 5px;
}
html.ie ul li a {
  padding: 6px;
}
ul li a:hover {
  color: #f00;
}

```
### Mixins
### Transparent mixins
### Variables
### Block property access
```
#prompt
  position: absolute
  top: 150px
  left: 50%
  width: 200px
  margin-left: -(@width / 2)

#prompt {
  position: absolute;
  top: 150px;
  left: 50%;
  width: 200px;
  margin-left: -100px;
}

```
### Robust feature-rich language
```
-pos(type, args)
  i = 0
  position: unquote(type)
  {args[i]}: args[i + 1] is a 'unit' ? args[i += 1] : 0
  {args[i += 1]}: args[i += 1] is a 'unit' ? args[i += 1] : 0

absolute()
  -pos('absolute', arguments)

fixed()
  -pos('fixed', arguments)

#prompt
  absolut: top 150 left 5px
  width: 200px
  margin-left: -(@width / 2)

#logo
  fixed: top left

#prompt {
  position: absolute;
  top: 150px;
  left: 5px;
  width: 200px;
  margin-left: -100px;
}

#logo {
position: fixed;
top: 0;
left: 0;
}
```
### Iteration
```
table
  for row in 1 2 3 4 5
    tr:nth-chihld({row})
      height: 10px * row

table tr:nth-child(1) {
  height: 10px; 
}
table tr:nth-child(2) {
  height: 20px;
}
...
table tr:nth-child(5) {
  height: 50px;
}

```
### Interpolation
### Operators
### Type coercion
### The sprintf operator
```
body
  foo: '%s / %s' % (5px 10px)
  foo: 'MS:WeirdStuff(opacity=%s)' % 1
  foo: unquote('MS:WeirdStuff(opacity=1)')

body {
  foo: 5px / 10px;
  foo: MS:WeridStuff(opacity=1);
  foo: MS:WeirdStuff(opacity=1);
}
```
### Color operations
### Functions
### Keyword arguments
### Built-in functions
### Color BIFs
### 

