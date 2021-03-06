// Vex Flow
// Mohit Muthanna <mohit@muthanna.com>
//
// Copyright Mohit Cheppudira 2010

/** @constructor */
Vex.Flow.Stave = function(x, y, width, options) {
  if (arguments.length > 0) this.init(x, y, width, options);
}

Vex.Flow.Stave.prototype.init = function(x, y, width, options) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.glyph_start_x = x + 5;
  this.start_x = this.glyph_start_x;
  this.context = null;
  this.glyphs = [];
  this.modifiers = [];  // non-glyph stave items (barlines, coda, segno, etc.)
  this.measure = 0;
  this.clef = "treble";
  this.font = {
    family: "sans-serif",
    size: 8,
    weight: ""
  };
  this.options = {
    vertical_bar_width: 10,       // Width around vertical bar end-marker
    glyph_spacing_px: 10,
    num_lines: 5,
    spacing_between_lines_px: 10, // in pixels
    space_above_staff_ln: 4,      // in staff lines
    space_below_staff_ln: 4,      // in staff lines
    top_text_position: 1,         // in staff lines
    bottom_text_position: 7       // in staff lines
  };
  Vex.Merge(this.options, options);

  this.height =
    (this.options.num_lines + this.options.space_above_staff_ln) *
     this.options.spacing_between_lines_px;
  this.modifiers.push(
      new Vex.Flow.Barline(Vex.Flow.Barline.type.SINGLE, this.x)); // beg bar
  this.modifiers.push(
      new Vex.Flow.Barline(Vex.Flow.Barline.type.SINGLE,
      this.x + this.width)); // end bar
}

Vex.Flow.Stave.prototype.setNoteStartX = function(x) {
  this.start_x = x; return this; }
Vex.Flow.Stave.prototype.getNoteStartX = function() {
  var start_x = this.start_x;

  // Add additional space if left barline is REPEAT_BEGIN
  if (this.modifiers[0].barline == Vex.Flow.Barline.type.REPEAT_BEGIN)
    start_x += 10;
  return start_x;
}
Vex.Flow.Stave.prototype.getNoteEndX = function() {
  return this.x + this.width; }
Vex.Flow.Stave.prototype.getTieStartX = function() {
  return this.start_x; }
Vex.Flow.Stave.prototype.getTieEndX = function() {
  return this.x + this.width; }
Vex.Flow.Stave.prototype.setContext = function(context) {
  this.context = context; return this; }
Vex.Flow.Stave.prototype.getX = function() {
  return this.x;
}
Vex.Flow.Stave.prototype.getNumLines = function() {
  return this.options.num_lines;
}
Vex.Flow.Stave.prototype.setY = function(y) {
  this.y = y; return this;
}
Vex.Flow.Stave.prototype.setWidth = function(width) {
  this.width = width;
  // reset the x position of the end barline
  this.modifiers[1].setX(this.x + this.width);
  return this;
}
Vex.Flow.Stave.prototype.setMeasure = function(measure) {
  this.measure = measure; return this;
}

  // Bar Line functions
Vex.Flow.Stave.prototype.setBegBarType = function(type) {
  // Only valid bar types at beginning of stave is none, single or begin repeat
  if (type == Vex.Flow.Barline.type.SINGLE ||
      type == Vex.Flow.Barline.type.REPEAT_BEGIN ||
      type == Vex.Flow.Barline.type.NONE) {
      this.modifiers[0] = new Vex.Flow.Barline(type, this.x);
  }
  return this;
}
Vex.Flow.Stave.prototype.setEndBarType = function(type) {
  // Repeat end not valid at end of stave
  if (type != Vex.Flow.Barline.type.REPEAT_BEGIN)
    this.modifiers[1] = new Vex.Flow.Barline(type, this.x + this.width);
  return this;
}

// Coda & Segno Symbol functions
Vex.Flow.Stave.prototype.setRepetitionTypeLeft = function(type, y) {
  this.modifiers.push(new Vex.Flow.Repetition(type, this.x, y));
  return this;
}
Vex.Flow.Stave.prototype.setRepetitionTypeRight = function(type, y) {
  this.modifiers.push(new Vex.Flow.Repetition(type, this.x, y) );
  return this;
}

// Volta functions
Vex.Flow.Stave.prototype.setVoltaType = function(type, number_t, y) {
  this.modifiers.push(new Vex.Flow.Volta(type, number_t, this.x, y));
  return this;
}

// Section functions
Vex.Flow.Stave.prototype.setSection = function(section, y) {
  this.modifiers.push(new Vex.Flow.StaveSection(section, this.x, y));
  return this;
}

Vex.Flow.Stave.prototype.getHeight = function(width) {
  return this.height;
}

Vex.Flow.Stave.prototype.getBottomY = function() {
  var options = this.options;
  var spacing = options.spacing_between_lines_px;
  var score_bottom = this.getYForLine(options.num_lines) +
     (options.space_below_staff_ln * spacing);

  return score_bottom;
}

Vex.Flow.Stave.prototype.getYForLine = function(line) {
  var options = this.options;
  var spacing = options.spacing_between_lines_px;
  var headroom = options.space_above_staff_ln;
  var y = this.y + ((line * spacing) + (headroom * spacing));

  return y;
}

Vex.Flow.Stave.prototype.getYForTopText = function(line) {
  var l = line || 0;
  return this.getYForLine(-l - this.options.top_text_position);
}

Vex.Flow.Stave.prototype.getYForBottomText = function(line) {
  var l = line || 0;
  return this.getYForLine(this.options.bottom_text_position + l);
}

Vex.Flow.Stave.prototype.getYForNote = function(line) {
  var options = this.options;
  var spacing = options.spacing_between_lines_px;
  var headroom = options.space_above_staff_ln;
  var y = this.y + (headroom * spacing) + (5 * spacing) - (line * spacing);

  return y;
}

Vex.Flow.Stave.prototype.getYForGlyphs = function() {
  return this.getYForLine(3);
}


Vex.Flow.Stave.prototype.addGlyph = function(glyph) {
  glyph.setStave(this);
  this.glyphs.push(glyph);
  this.start_x += glyph.getMetrics().width;
  return this;
}

Vex.Flow.Stave.prototype.addModifier = function(modifier) {
  modifier.addToStave(this, (this.glyphs.length == 0));
  return this;
}

Vex.Flow.Stave.prototype.addKeySignature = function(keySpec) {
  this.addModifier(new Vex.Flow.KeySignature(keySpec));
  return this;
}

Vex.Flow.Stave.prototype.addClef = function(clef) {
  this.clef = clef;
  this.addModifier(new Vex.Flow.Clef(clef));
  return this;
}

Vex.Flow.Stave.prototype.addTimeSignature = function(timeSpec) {
  this.addModifier(new Vex.Flow.TimeSignature(timeSpec));
  return this;
}

Vex.Flow.Stave.prototype.addTempo = function(note, tempoSpec) {
  this.addModifier(new Vex.Flow.Tempo(note, tempoSpec));
  return this;
}

Vex.Flow.Stave.prototype.addTrebleGlyph = function() {
  this.clef = "treble";
  this.addGlyph(new Vex.Flow.Glyph("v83", 40));
  return this;
}

/**
 * All drawing functions below need the context to be set.
 */
Vex.Flow.Stave.prototype.draw = function(context) {
  if (!this.context) throw new Vex.RERR("NoCanvasContext",
      "Can't draw stave without canvas context.");

  var num_lines = this.options.num_lines;
  var width = this.width;
  var x = this.x;

  for (var line=0; line < num_lines; line++) {

    var y = this.getYForLine(line);
    this.context.fillRect(x, y, width, 1);
  }

  x = this.glyph_start_x;
  var bar_x_shift = 0;
  for (var i = 0; i < this.glyphs.length; ++i) {
    var glyph = this.glyphs[i];
    if (!glyph.getContext()) glyph.setContext(this.context);
    glyph.renderToStave(x);
    x += glyph.getMetrics().width;
    bar_x_shift += glyph.getMetrics().width;
  }
  // Add padding after clef, time sig, key sig
  if (bar_x_shift > 0) bar_x_shift += this.options.vertical_bar_width;
  // Draw the modifiers (bar lines, coda, segno, repeat brackets, etc.)
  for (var i = 0; i < this.modifiers.length; i++) {
    this.modifiers[i].draw(this, bar_x_shift);
  }
  if (this.measure > 0) {
    this.context.save()
    this.context.setFont(this.font.family, this.font.size, this.font.weight);
    var text_width = this.context.measureText("" + this.measure).width;
    var y = this.getYForTopText(0) + 3;
    this.context.fillText("" + this.measure, this.x - text_width / 2, y);
    this.context.restore();
  }

  return this;
}

//Add Ledger Line to Stave
// TODO(3logy): LedgerLine z-index needs to be behind all others Elements.
Vex.Flow.Stave.prototype.addLedgerLine = function(){
 if (!this.context) throw new Vex.RERR("NoCanvasContext",
    "Can't draw stave without canvas context.");
  
  var num_lines = this.options.num_lines;
  var width = this.width;
  var x = this.x;
  var ctx = this.context;
  
  if(ctx.canvas != null){
	var initX = ctx.canvas.clientLeft;
	var topY = 40;
	var bottomY = 40 + (num_lines * 10) + 10;
	var initY = ctx.canvas.clientTop;
	var initH = ctx.canvas.clientHeight;
	var initW = ctx.canvas.clientWidth;
	ctx.strokeStyle = "#f54";
	ctx.beginPath();
	
	//Draw three ledger lines above stave
	for(var line = -3; line < 0; line++){
		ctx.moveTo(initX, topY);
		ctx.lineTo(initW, topY);
		topY = topY - 10;
	}
	
	//Draw three ledger lines below stave
	for(var line = num_lines; line < 8; line++){
		ctx.moveTo(initX, bottomY);
		ctx.lineTo(initW, bottomY);
		bottomY = bottomY + 10;
	}
	ctx.stroke(); 
  }
  
  if(this.context.paper != null){
	  
	var X , top, bottom, topY, bottomY, W, H, dist;
	var attr = new Array();
	attr = this.context.element.firstElementChild.childNodes[2].attributes;
	attr2 = this.context.element.firstElementChild.childNodes[2 + num_lines -1].attributes;
	var temp1 = this.context.element.firstElementChild.childNodes[3].attributes.y.value;
	var temp2 = this.context.element.firstElementChild.childNodes[2].attributes.y.value;
	dist = parseFloat(temp1 - temp2);
	
	for(var x = 0; x < attr.length; x++)
	{   if(attr[x].nodeName == "x")
		{
			X = attr[x].value;  
		}
			
		if(attr[x].nodeName == "y")
		{
			top = attr[x].value;
			topY = parseFloat(top) - dist;
		}
		
		if(attr[x].nodeName == "width")
			W = attr[x].value;
			
		if(attr[x].nodeName == "height")
			H = attr[x].value;
	}
	
	for(var x = 0; x < attr2.length; x++)
	{
		if(attr2[x].nodeName == "y")
		{
			bottom = attr2[x].value;
			bottomY = parseFloat(bottom) + dist;
		} 
	}
	//Draw three ledger lines above stave
	for(var line = -3; line < 0; line++){
		this.context.fillRectLedger(X, topY, W, 2);
		topY = topY - dist;
	}
	
	//Draw three ledger lines below stave
	for(var line = num_lines; line < 8; line++){		
		this.context.fillRectLedger(X, bottomY, W, 2);
		bottomY = bottomY + dist;
	}
  }
}


// Draw Simple barlines for backward compatability
// Do not delete - draws the beginning bar of the stave
Vex.Flow.Stave.prototype.drawVertical = function(x, isDouble) {
  this.drawVerticalFixed(this.x + x, isDouble);
}

Vex.Flow.Stave.prototype.drawVerticalFixed = function(x, isDouble) {
  if (!this.context) throw new Vex.RERR("NoCanvasContext",
      "Can't draw stave without canvas context.");

  var top_line = this.getYForLine(0);
  var bottom_line = this.getYForLine(this.options.num_lines - 1);
  if (isDouble)
    this.context.fillRect(x - 3, top_line, 1, bottom_line - top_line + 1);
  this.context.fillRect(x, top_line, 1, bottom_line - top_line + 1);
}

Vex.Flow.Stave.prototype.drawVerticalBar = function(x) {
  this.drawVerticalBarFixed(this.x + x, false);
}

Vex.Flow.Stave.prototype.drawVerticalBarFixed = function(x) {
  if (!this.context) throw new Vex.RERR("NoCanvasContext",
      "Can't draw stave without canvas context.");

  var top_line = this.getYForLine(0);
  var bottom_line = this.getYForLine(this.options.num_lines - 1);
  this.context.fillRect(x, top_line, 1, bottom_line - top_line + 1);
}
