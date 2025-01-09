const convertBytesToMB = (bytes) => {
    return bytes / 1000 / 1000;
}

let activateMemoryUsageTracker = true;

const measureMemoryUsage = async (stepName) => {
    try {


        if (activateMemoryUsageTracker === false) {
            return;
        }

        const responseOutputElement = document.getElementById("responseOutput");

        if (responseOutputElement.value !== "") {
            document.getElementById("responseOutput").value += "\n\n";
        }

        document.getElementById("responseOutput").value += "[" + stepName + "] - Measuring memory using 'performance.measureUserAgentSpecificMemory()'...      **This can take 1-2 minutes.**\n"
        const measurement = await performance.measureUserAgentSpecificMemory();
        document.getElementById("responseOutput").value += "[" + stepName + "] - Memory measurement completed.\n\n"

        console.log(measurement);

        const sharedMemoryUsage = measurement.breakdown.find(element => element.types.findIndex(item => item === "Shared") != -1).bytes;
        const jsMemoryUsage = measurement.breakdown.find(element => element.types.findIndex(item => item === "JavaScript") != -1).bytes;
        const domMemoryUsage = measurement.breakdown.find(element => element.types.findIndex(item => item === "DOM") != -1).bytes;

        const totalBytes = measurement.bytes;

        document.getElementById("memory_usage_table_tbody").innerHTML += "<tr>" +
            "<td>" + stepName + "</td>" +
            "<td>" + convertBytesToMB(sharedMemoryUsage).toFixed(2) + " MB</td>" +
            "<td>" + convertBytesToMB(jsMemoryUsage).toFixed(2) + " MB</td>" +
            "<td>" + convertBytesToMB(domMemoryUsage).toFixed(2) + " MB</td>" +
            "<td>" + convertBytesToMB(totalBytes).toFixed(2) + " MB</td>" +
            "</tr>";

    } catch (e) {
        console.error(e);
    }
}

document.getElementById("memory_usage_tracker").onclick = () => {
    activateMemoryUsageTracker = document.getElementById("memory_usage_tracker").checked;
}