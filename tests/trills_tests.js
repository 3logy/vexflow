// VexFlow - Trill Tests

Vex.Flow.Test.Trill = {}

Vex.Flow.Test.Trill.Start = function() {
  module("Trill");
  Vex.Flow.Test.runTest("Trill", Vex.Flow.Test.Trill.basic);
  Vex.Flow.Test.runRaphaelTest("Trill (Raphael)",
      Vex.Flow.Test.Trill.basic);
}

Vex.Flow.Test.Trill.basic = function(options, contextBuilder) {
  var ctx = contextBuilder(options.canvas_sel, 500, 240);
  ctx.scale(1.5, 1.5); ctx.fillStyle = "#221"; ctx.strokeStyle = "#221";
  var stave = new Vex.Flow.Stave(10, 10, 300).
    addClef("treble").setContext(ctx).draw();

  function newNote(note_struct) { return new Vex.Flow.StaveNote(note_struct); }

   var notes = [
  	 newNote({ keys: ["d/4"], duration: "h"}).addTrill(Vex.Flow.trillCodes.trills.tr),
     newNote({ keys: ["f/4"], duration: "h"}).addTrill(Vex.Flow.trillCodes.trills.turn),
     newNote({ keys: ["a/4"], duration: "w"}).addTrill(Vex.Flow.trillCodes.trills.gruppetto),
     newNote({ keys: ["a/4"], duration: "h"}).addTrill(Vex.Flow.trillCodes.trills.mordent),
     newNote({ keys: ["c/5"], duration: "h"}).addTrill(Vex.Flow.trillCodes.trills.mordentTurn),
     newNote({ keys: ["e/5"], duration: "h"}).addTrill(Vex.Flow.trillCodes.trills.lowerPrefix),
     newNote({ keys: ["b/4"], duration: "h"}).addTrill(Vex.Flow.trillCodes.trills.lowerPrefixTurn),
     newNote({ keys: ["e/4"], duration: "w"}).addTrill(Vex.Flow.trillCodes.trills.upperPrefix),
     newNote({ keys: ["c/5"], duration: "h"}).addTrill(Vex.Flow.trillCodes.trills.upperPrefixTurn),
     newNote({ keys: ["e/5"], duration: "h"}).addTrill(Vex.Flow.trillCodes.trills.upperSuffix)
   ];

  Vex.Flow.Formatter.FormatAndDraw(ctx, stave, notes, 100);
  ok(true, "Trill");
}
