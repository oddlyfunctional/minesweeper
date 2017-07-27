$(function() {
  $('[name="rows"], [name="columns"], [name="chance"]').on("input", resetGame);
  $("#reset").click(resetGame);

  $(document).on("mousedown", function(event) {
    if (event.which == 3) {
      var td = $(event.target);

      if (td.hasClass("unopened")) {
        td.removeClass().addClass("flagged");
      } else if (td.hasClass("flagged")) {
        td.removeClass().addClass("question");
      } else if (td.hasClass("question")) {
        td.removeClass().addClass("unopened");
      }
    }
  });

  resetGame();

  function resetGame() {
    var rows = $('[name="rows"]').val();
    var columns = $('[name="columns"]').val();
    var chance = $('[name="chance"]').val() / 100.0;

    $("#minesweeper").html("");

    var minesCount = 0;
    for(var i = 0; i < rows; i += 1) {
      var tr = $("<tr></tr>");

      for(var j = 0; j < columns; j += 1) {
        var td = $("<td></td>");
        td.addClass("unopened");
        td.data("row", i);
        td.data("column", j);

        var hasMine = Math.random() < chance;
        if (hasMine) {
          td.data("mine", true);
          minesCount += 1;
        }
        td.appendTo(tr);
      }

      tr.appendTo("#minesweeper");
    }

    console.log("Got " + minesCount + " mines out of " + (rows * columns) + " tiles.");

    $(".unopened").on("click", function() {
      clickCell($(this));
    });
  }

	function findCell(row, column) {
		if (row < 0 || column < 0) {
			return $([]);
		}
		return $("tr").eq(row).find("td").eq(column);
	}

	function clickCell(td) {
		if (!td.hasClass("unopened")) {
			return;
		}

		td.removeClass();
		if (td.data("mine")) {
			$("td").each(function(_, td) {
				td = $(td);
				if (td.data("mine")) {
					td.removeClass().addClass("mine");
				}
			});
		} else {
			var row = td.data("row")
			var column = td.data("column");
			var minesCount = 0;

			for(var rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
				for(var columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
					if (findCell(row - rowOffset, column - columnOffset).data("mine")) {
						minesCount += 1;
					}
				}
			}

			if (minesCount == 0) {
				td.addClass("opened");

				for(var rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
					for(var columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
						var neighbour = findCell(row - rowOffset, column - columnOffset);

						if (neighbour.hasClass("unopened")) {
							clickCell(neighbour);
						}
					}
				}
			} else {
				td.addClass("mine-neighbour-" + minesCount);
			}
		}
	}
});
