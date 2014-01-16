# Awesomeness Boilerplate

		
## Getting Started


What you'll need to get going:
	
* All the requirements installed
* Compass up and running
* Basic understanding of how to use CSS modules
* Basic understanding of how to use dynamic JavaScript modules

Awesomeness provides a lot of cool tools but you'll have to connect the dots yourself. We'll try to provide all the necessary information on this page but it might be useful to read some documentation and tutorials related to each tool (i. e. Sass/Compass, Susy, RequireJS, etc.).

## Requirements


Due to its nature of being a design and development framework, Awesomeness **does not work out of the box**. It heavily relies on other tools and frameworks and combines them to provide great flexibility and power.
					
### 1. Ruby

If you're a Mac user it's easy — Ruby is already installed on your machine. If you happen to be using Windows, please go to the  [Ruby download page](http://rubyinstaller.org/), where you can find an installer and further instructions on how to proceed.

### 2. Gems

Awesomeness is built upon Sass and Compass and uses the Susy grid framework for layouting and normalize.css to softly reset browser default CSS. Hence you need to install the following gems:

* sass
* compass
* compass-normalize
* susy

Simply fire up Terminal (or Command Prompt on Windows) and type in this command:

`$ gem install sass compass compass-normalize susy`
				
This will install all four gems, as well as their dependencies. Hooray!

### 3. RequireJS	

Since a proper modular approach to JavaScript architecture is especially important when you plan to use your interactive components in different environments, we chose to integrate RequireJS and let it handle the dependency management.

*Attention: RequireJS comes with the Awesomeness download bundle but if you want to automatically create a build of your app, you have to make sure that [node.js](http://nodejs.org/) is installed on your system.*
				
## How To

### Instantly work with Awesomeness

1. Install [Ruby](http://rubyinstaller.org) (Windows only)
2. Install Gems
	`$ gem install sass compass compass-normalize susy`
3. Inside folder `Awesomeness-Boilerplate/PROJECTNAME/` launch compass `$ compass watch`
4. Start building awesome things

### Import Static Components

1. Create a `<custom-name>.html` HTML page, add the component code to it, for example
     	<pre><code>&lt;div class=&quot;msg&quot;&gt;Content&lt;/div&gt;</code></pre>
2. Add a `<custom-name>.scss` Sass file and import base styles and the component like so
	<pre class="msg__bd language-css"><code>@import "base";@import "imports/modules/msg";</code></pre>
3. Connect the dots
	<pre class="msg__bd language-markup"><code>&lt;link rel=&quot;stylesheet&quot; href=&quot;/css/&lt;custom-name&gt;.css&quot;&gt;</code></pre>
						

### Import Dynamic Components

1. Follow the steps on how to import a static content
2. Add a `<custom-name>.js` JavaScript file and require and initialize the component like so
	<pre class="msg__bd language-javascript"><code>
		require(["tabacccontroller"], function(TabAccController)
		{
			// Initialize tab2acc component
			TabAccController.init();
		});
	</code></pre>
					
3. Connect the dots and add the JavaScript file to your HTML
	<pre class="msg__bd language-markup"><code>
		&lt;!-- RequireJS --&gt;
		&lt;script src=&quot;/js/require.js&quot;&gt;&lt;/script&gt;
		&lt;script&gt;
		// Load page logic
		require([&#039;/js/&lt;custom-name&gt;.js&#039;]);
		&lt;/script&gt;
	</code></pre>

*Attention: The Button Dropdown component is special. There is no init method. You just have to require the component in your JavaScript and it will initialize itself.*
				
### Build your application

At some point you might want to lift your application from a development to a production stage in order to improve performance and upload it to a live server. RequireJS can do the heavylifting, building the app, removing all unnecessary files and concatenating and minifying JavaScript and CSS.

1. If you haven't already done this, rename the `PROJECTNAME/` folder to the name of your app.
2. In `Awesomeness-Boilerplate/` folder locate the`build.sh` file, open it and set the project name variable accordingly.<pre><code># Project name variable must be the same as your main project folder
P="PROJECTNAME"</code></pre>
3. Open your Terminal and run the build script.
	<pre><code>$ ./build.sh</code></pre>

This will create a new folder called `the-build/` inside your `Awesomeness-Boilerplate/` folder. There you will find an optimized and stripped down copy of your application, ready for upload.
					
*Attention: RequireJS relies on the `app.build.js` configuration file for building. There you must include the JavaScript modules which need to be available in production stage, like so:*

<pre class="language-javascript"><code>
	modules: [
    	{
		name: "common"
	},
	{
		name: "main-forms",
        	exclude: ["common"]
    	}
   	]
</code></pre>

If you're not familiar with this, please read the [RequireJS documentation](http://requirejs.org/docs/optimization.html#wholemultipage) and/or this very [good tutorial](http://robdodson.me/blog/2012/11/18/a-require-dot-js-multipage-shimmed-site-how-to/) by Rob Dodson.



					
