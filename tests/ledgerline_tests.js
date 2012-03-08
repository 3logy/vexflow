/**
 * VexFlow - Ledgerline Tests
 * Copyright 3logy 2012 <the3logy@gmail.com>
 */
 
Vex.Flow.Test.LedgerLine = {}

Vex.Flow.Test.LedgerLine.Start = function() {
  module("LedgerLine");
  Vex.Flow.Test.runTest("Basic", Vex.Flow.Test.LedgerLine.basic);
  Vex.Flow.Test.runRaphaelTest("Basic (Raphael)", Vex.Flow.Test.LedgerLine.basic);
}

Vex.Flow.Test.LedgerLine.basic = function(options, contextBuilder) {
  var ctx = new contextBuilder(options.canvas_sel, 700, 240);
  console.log(ctx);
  ctx.scale(1.5, 1.5); ctx.setFillStyle("#221"); ctx.setStrokeStyle("#221");
  var stave = new Vex.Flow.Stave(10, 10, 550);
  stave.setContext(ctx).draw(); 
  
  //don't use it like : stave.setContext(ctx).draw().addLedgerLine();
  stave.addLedgerLine();

  ok(true, "Full LedgerLine");
}
