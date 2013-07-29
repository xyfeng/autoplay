##Autoplay
A jQuery plugin to automate user scenarios by [XY Feng](http://xystudio.cc)

Demo: [link](http://xyfeng.github.io/autoplay)

###Features
**Autoplay** reads in user scripted 'commands' line by line. By excuting each 'command', it controls a simulated cursor moving around, typing into input fields, and displaying overlay messages.

*   **Move cursor around**
*(Cursor can be moved to any given position on screen, or moved to the center of an object in any speed.)*
*   **Trigger click event**
*(Trigger mouse click event on any given object.)*
*   **Type into text field**
*(Simulate typing inside input or textarea, character by character.)*
*   **Scroll page**
*(Scroll page or scroll any given object, supporting both horizontal and vertical direction.)*
*   **Display message**
*(Display an overlay message with FADE transition, message style is fully customizable.)*
*   **Pause and Resume**
*(Press space bar to pause the running script; Press Right Arrow key to resume it.)*
*   **Quick Exit**
*(User has full control of the mouse cursor all the time, click mouse in everywhere on the page will exit the autoplay mode.)*

###Learning
Ready to learn some 'command'?

Here is the format: **command->object->parameters->duration**

*object* is [jQuery selector](http://api.jquery.com/category/selectors/) string, for example: **#navbar li:first-child a**

#####Wait
	wait->3000 
	[Let the cursor stay at its location for 3000 milliseconds.]
#####Move
	move->#feature_box
	[Move cursor to the center of object #feature_box in default speed.]

	move->#feature_box->3000
	[Move cursor to the center of object #feature_box in 3000 milliseconds.]

	move->#feature_box->300,200
	[Move cursor to object #feature_box, offset (300px,200px) from the top-left corner of #feature_box in default speed.]

	move->#feature_box->300,200->3000 
	[Move cursor to object #feature_box, offset (300px,200px) from the top-left corner of #feature_box in 3000 milliseconds.]

	move->300,200 	
	[Move cursor to position (300px,200px), offset from the top-left corner of the window in default speed.]

	move->300,200->3000 
	[Move cursor to position (300px,200px), offset from the top-left corner of the window in 3000 milliseconds.]

#####Click
	click->#login_btn
	[Trigger click event on object #login_btn]

#####GoClick
	goclick->#login_btn
	[Move cursor to the center of object #login_btn and trigger click event.]

#####Type
	type->#email_input->example@gmail.com
	[Type inside #email_input with word: example@gmail.com.]

#####GoType
	gotype->#email_input->example@gmail.com 
	[Move cursor to the center of #email_input and type out example@gmail.com character by character.]

#####ScrollX
	scrollx->1000 
	[Scroll window horizontally, offsetting its left position to 1000 pixels.]

	scrollx->#features_list->1000 
	[Scroll #features_list horizontally, offsetting its left position to 1000 pixels.]

#####ScrollY
	scrolly->1000 
	[Scroll window vertically, offsetting its top position to 1000 pixels.]

	scrolly->#features_list->1000
	[Scroll #features_list vertically, offsetting its top position to 1000 pixels.]

#####Display
Use default class 'center' for a centered message on a screen overlay; use default class 'bottom' for a centered message on a bottom-overlay bar.

	display->Scenario 1: Browse to a file.
	[Display message 'Scenario 1: Browse to a file.' in a screen overlay for 2000 milliseconds.]

	display->Scenario 1: Browse to a file.->3000 
	[Display message 'Scenario 1: Browse to a file.' in a screen overlay for 3000 milliseconds.]

	display->message_class->Scenario 1: Browse to a file.
	[Display message 'Scenario 1: Browse to a file.' in a customized overlay .message_class for 2000 milliseconds.]

	display->message_class->Scenario 1: Browse to a file.->3000
	[Display message 'Scenario 1: Browse to a file.' in a customized overlay .message_class for 3000 milliseconds.]

###Usage
#####Add Autoplay

Add autoplay.js and autoplay.css to your web application.

#####Write commands
Write down your steps in JSON array format, for example:

	var script = [
		"move->60,120",
		"display->circle->DEMO",
		"wait->1000",
		"goclick->#feature_btn"
	];
	
#####Run Script
In one line call:

	autoplay.initWithScript(script);
To load script dynamically, use two seperate calls:

	autoplay.init();
	autoplay.loadScript(script);
#####Customize display message
Injected display message markup
	
	<div id="autoplay_display">
		<div class="message">
			<p>message goes here</p>
		</div>
	</div>
Sample code to style a message in circled overlay
	
	/* stylesheet */
	#autoplay_display.circle {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background: rgba(0,0,0,0.8);
	}
	#autoplay_display.circle .message {
		width: 300px;
		height: 300px;
		position: absolute;
		margin-left: -150px;
		margin-top: -150px;
		border-radius: 150px;d
		left: 50%;
		top: 50%;
		background: rgba(255,255,255,0.95);
		font-size: 45px;
		line-height: 300px;
		color: #030303;
	}
	
###FAQs
#####What does 'autoplay' best for?
If you ever need to present web applicaion to clients, you often choose to deliver the application along with detailed wireframes or screen capture videos.
With 'autoplay', you can build user scenario right into the application, animated user flow and the application will be in one place.
#####What if I have to open different pages in one flow?
Although'autoplay' only runs within one page, if you break your 'big' flow into pages, you can run different scripts in each page, it will still work out when you view as one flow.
#####I don't like the green dot cursor!
'Green Dot' is easy to customize, if you lookup the autoplay.css, you will notice different cursor state has differnt add-on class, simply overwrite the css stylesheet.

###Contact

Twitter: [@xy_feng](https://twitter.com/xy_feng)

Email: <xy@xystudio.cc>