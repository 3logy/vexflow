// VexFlow - Basic Tests

Vex.Flow.Test.Clef = {}

Vex.Flow.Test.Clef.Start = function() {
  module("Clef");
  Vex.Flow.Test.runTest("Clef Test", Vex.Flow.Test.Clef.draw);
  Vex.Flow.Test.runRaphaelTest("Clef Test (Raphael)", 
      Vex.Flow.Test.Clef.draw);
}

Vex.Flow.Test.Clef.draw = function(options, contextBuilder) {
  var ctx = new contextBuilder(options.canvas_sel, 400, 120);
  var stave = new Vex.Flow.Stave(10, 10, 350);

  stave.addClef("treble");
  stave.addClef("bass");
  stave.addClef("alto");  
  stave.addClef("tenor");
  stave.addClef("french_violin");
  stave.addClef("soprano");
  stave.addClef("mezzo_soprano");
  stave.addClef("baritone");
  stave.addClef("baritone_bass");
  stave.addClef("sub_bass");

  stave.setContext(ctx);
  stave.draw();

  ok(true, "all pass");
}


