# Awesomeness Boilerplate

> Awesomeness is a a modular and flexible responsive framework

## Getting Started

What you'll need to get going

* All the requirements installed
* Basic understanding of how to use CSS modules
* Basic understanding of how to use dynamic JavaScript modules

Awesomeness provides a lot of cool tools but you'll have to connect the dots yourself. We'll try to provide all the necessary information on this page but it might be useful to read some documentation and tutorials related to each tool (i. e. Sass/Compass, Susy, RequireJS, etc.).

## Requirements

Due to its nature of being a design and development framework, Awesomeness **does not work out of the box**. It heavily relies on other tools and frameworks and combines them to provide great flexibility and power.

### Ruby

If you're a Mac user it's easy — Ruby is already installed on your machine. If you happen to be using Windows, please go to the [Ruby download page](http://rubyinstaller.org/), where you can find an installer and further instructions on how to proceed.

#### Ruby Gems

Awesomeness is built upon Sass and Compass and uses the Susy grid framework for layouting and normalize.css to softly reset browser default CSS. Hence you need to install the following gems: sass, compass, compass-normalize, susy and breakpoint.

Simply fire up Terminal (or Command Prompt on Windows) and type in this command:

```shell
$ gem install sass compass:1.0.0.alpha.19 compass-normalize susy breakpoint
```
This will install all four gems, as well as their dependencies. Hooray!

### Node.js

Awesomeness uses some of the incredible tools built with Node.js such as the taskrunner Grunt. Download it from the official [Node.js website](http://nodejs.org/).

## How To instantly work with Awesomeness

The best way to get started wi th a new Awesomeness-prject is to use the Yeoman generator, which scaffolds a new project for you:

- Install [Ruby](http://rubyinstaller.org) (Windows only)
- Install Gems
```shell
$ gem install sass compass:1.0.0.alpha.19 compass-normalize susy breakpoint
```
- Install [Node.js](http://nodejs.org/)
- Install the awesomeness generator. This programm will set up your Awesomeness project for you. As you install this npm package globally, you will have to use the prefix _sudo_ prompting you for your computer's administrator password.
```shell
$ sudo npm install -g generator-awesomeness
```
- Create a new directory for your project
```shell
$ mkdir my-new-project && cd $_
```
- Run the generator
```shell
$ yo awesomeness
```
- Run grunt and start building great things! This will automatically open a new browser window that updates as you make changes to your project. Neat!
```shell
$ grunt serve
```

## Import Static Components

- Create a `<custom-name>.html` HTML page, add the component code to it, for example
```html
<div class="msg">
	Content
</div>
```
- Add a `<custom-name>.scss` Sass file and import base styles and the component like so
```css
@import "base";
@import "imports/modules/msg";
```
- Connect the dots
```html
<link rel="stylesheet" href="/css/<custom-name>.css">
```

## Import Dynamic Components

Follow the steps on how to import a static content
- Add a `<custom-name>.js` JavaScript file and require and initialize the component like so
```javascript
require(["tabacccontroller"], function(TabAccController)
{
	// Initialize tab2acc component
	TabAccController.init();
});
```

- Connect the dots and add the JavaScript file to your HTML
```html
<!-- RequireJS -->
<script src="/js/require.js"></script>
<script>
	// Load page logic
	require(['/js/<custom-name>.js']);
</script>
```

*Attention: The Button Dropdown component is special. There is no init method. You just have to require the component in your JavaScript and it will initialize itself.*

## Build your application

At some point you might want to lift your application from a development to a production stage in order to improve performance and upload it to a live server. Grunt can do the heavylifting, building the app, removing all unnecessary files and concatenating & minifying JavaScript and CSS.

When you're ready to build your application just run
```shell
$ grunt build
```
Grunt will compile the optimized application to the directory /dist/

*You have to define new modules for RequireJS in your .Gruntfile.js. There you must include the JavaScript modules which need to be available in production stage, like so:*

```javascript
modules: [
{
	name: "common"
},
{
	name: "main-forms",
	exclude: ["common"]
}
]
```

If you're not familiar with this, please read the [RequireJS documentation](http://requirejs.org/docs/optimization.html#wholemultipage) and the [description for grunt-contrib-requirejs](https://github.com/gruntjs/grunt-contrib-requirejs).

## License

MIT
