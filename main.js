var fileInput = document.getElementById("file-upload");
fileInput.addEventListener("change", function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function() {
        var data = reader.result;
        var lines = data.split("\n");
        var chartTitle = "";
        var subsetData = [];
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].startsWith(",,Volume")) {
                chartTitle = previousLine;
                subsetData.push(lines[i]);
            } else if (lines[i].startsWith(",,")) {
                var cleanedLine = lines[i].replace(/"([^"]+),([^"]+)"/g, "\"$1$2\"");
                subsetData.push(cleanedLine);
            }
            var previousLine = lines[i];
        }
        
        // remove quotation marks from subsetData
        for (var i = 0; i < subsetData.length; i++) {
            subsetData[i] = subsetData[i].replace(/"/g,"").replaceAll(",,","");
        }
        
        var titleDiv = document.getElementById("chart-title");
        titleDiv.innerHTML = chartTitle;
        
        var table = document.getElementById("subset-table");
        var tableHTML = "<table class='table'>";
        var volumeColumns = [];
        for (var i = 0; i < subsetData.length; i++) {
            var row = subsetData[i].split(",");
            var totalVolume = 0;
            tableHTML += "<tr>";
            for (var j = 0; j < row.length; j++) {
                if (i == 0) {
                    tableHTML += "<th>" + row[j] + "</th>";
                    if (row[j] == "Volume") {
                        volumeColumns.push(j);
                    }
                } else {
                     if ( volumeColumns.includes(j) ) {
                        if (row[j] != "" && row[j] != "<empty>") {
                            totalVolume += parseInt(row[j]);
                        }
                        console.log("j: " + totalVolume);
                     }
                    tableHTML += "<td>" + row[j] + "</td>";
                }
            }
            if (i == 0) {
                tableHTML += "<th>Total Volume</th>";
            } else {
                tableHTML += "<td>" + totalVolume + "</td>";
            }
            tableHTML += "</tr>";
        }
        //console.log(volumeColumns);
        tableHTML += "</table>";
        table.innerHTML = tableHTML;
    };
    reader.readAsText(file);
});
