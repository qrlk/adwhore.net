var mode = 1;
let baseUrl = "https://karma.adwhore.net:47976"

function updateDisplay(mode) {
    if (mode === 5) {
        document.getElementById("acceptable_table").style.display = ""
        document.getElementById("trust_table").style.display = ""
        document.getElementById("custom").style.display = ""
    } else {
        document.getElementById("acceptable_table").style.display = "none"
        document.getElementById("trust_table").style.display = "none"
        document.getElementById("custom").style.display = "none"
    }
}

document.getElementById('increaseButton1').onclick = function () {
    if (+document.getElementById('displayDiv1').innerText < 100) {
        document.getElementById('displayDiv1').innerText = +document.getElementById('displayDiv1').innerText + 5;
        savePopupSettings();
    }
};
document.getElementById('decreaseButton1').onclick = function () {
    if (+document.getElementById('displayDiv1').innerText > 0) {
        document.getElementById('displayDiv1').innerText = +document.getElementById('displayDiv1').innerText - 5;
        savePopupSettings();
    }
};
document.getElementById('increaseButton2').onclick = function () {
    if (+document.getElementById('displayDiv2').innerText < 100) {
        document.getElementById('displayDiv2').innerText = +document.getElementById('displayDiv2').innerText + 5;
        savePopupSettings();
    }
};
document.getElementById('decreaseButton2').onclick = function () {
    if (+document.getElementById('displayDiv2').innerText > 0) {
        document.getElementById('displayDiv2').innerText = +document.getElementById('displayDiv2').innerText - 5;
        savePopupSettings();
    }
};


document.getElementById('buttonSave1').onclick = function () {
    chrome.storage.sync.get(["name", "secret"], function (result) {
            if (!(result["name"] === document.getElementById("nickname").value)) {
                $.ajax
                ({
                    url: `${baseUrl}/api/v0/updateNickname`,
                    type: "POST",
                    data: JSON.stringify({
                        "secret": result["secret"],
                        "name": document.getElementById("nickname").value
                    }),
                    contentType: 'application/json',
                    success: function (data) {
                        chrome.storage.sync.set({"name": data["name"]});
                        document.getElementById("nickname").value = data["name"];
                        alert("Success\n" + JSON.stringify(data));
                    },
                    error: function (s, status, error) {
                        alert('error\n' + status + '\n' + error);
                    }
                })
            }
        }
    )
};

document.getElementById('buttonSave2').onclick = function () {
    chrome.storage.sync.get(["name", "secret"], function (result) {
            if (!(result["secret"] === document.getElementById("secret").value)) {
                $.ajax
                ({
                    url: `${baseUrl}/api/v0/switchUserSecret`,
                    type: "POST",
                    data: JSON.stringify({"secret": document.getElementById("secret").value}),
                    contentType: 'application/json',
                    success: function (data) {
                        chrome.storage.sync.set({"name": data["name"], "secret": data["secret"], "side": data["side"]});
                        document.getElementById("secret").value = data["secret"];
                        document.getElementById("nickname").value = data["name"];
                        side_select.value = data["side"]
                        alert("Success\n" + JSON.stringify(data));
                    },
                    error: function (s, status, error) {
                        alert('error\n' + status + '\n' + error);
                    }
                })
            }

        }
    )
};

document.getElementById('buttonNew').onclick = function () {
    chrome.storage.sync.get(["name", "secret"], function (result) {
            $.ajax
            ({
                url: `${baseUrl}/api/v0/addNewUser`,
                type: "POST",
                data: JSON.stringify({"secret": document.getElementById("secret").value}),
                contentType: 'application/json',
                success: function (data) {
                    chrome.storage.sync.set({"name": data["name"], "secret": data["secret"], "side": data["side"]});
                    document.getElementById("secret").value = data["secret"];
                    document.getElementById("nickname").value = data["name"];
                    side_select.value = data["side"]
                    alert("Success\n" + JSON.stringify(data));
                },
                error: function (s, status, error) {
                    alert('error\n' + status + '\n' + error);
                }
            })

        }
    )
};


$('[name="secret"]').focus(function () {
    $(this).attr("type", "text")
});
$('[name="secret"]').blur(function () {
    $(this).attr("type", "password")
});


chrome.storage.sync.get(null, function (result) {
    if (result["secret"] == null) {
        $.ajax
        ({
            url: `${baseUrl}/api/v0/addNewUser`,
            type: "POST",
            data: JSON.stringify({"uuid": result["uuid"]}),
            contentType: 'application/json',
            success: function (data) {
                chrome.storage.sync.set({"secret": data["secret"], "name": data["name"], "side": data["side"]});
                document.getElementById("nickname").value = data["name"];
                document.getElementById("secret").value = data["secret"];
                side_select.value = data["side"]

                // alert("ADN user registered\n"+JSON.stringify(data));
            }
        })
    }

    document.getElementById("hate-y1").checked = result["custom"]["hate"]["y1"];
    document.getElementById("hate-y2").checked = result["custom"]["hate"]["y2"];
    document.getElementById("hate-a1").checked = result["custom"]["hate"]["a1"];
    document.getElementById("hate-a2").checked = result["custom"]["hate"]["a2"];

    document.getElementById("fine-y1").checked = result["custom"]["fine"]["y1"];
    document.getElementById("fine-y2").checked = result["custom"]["fine"]["y2"];
    document.getElementById("fine-a1").checked = result["custom"]["fine"]["a1"];
    document.getElementById("fine-a2").checked = result["custom"]["fine"]["a2"];

    document.getElementById("love-y1").checked = result["custom"]["love"]["y1"];
    document.getElementById("love-y2").checked = result["custom"]["love"]["y2"];
    document.getElementById("love-a1").checked = result["custom"]["love"]["a1"];
    document.getElementById("love-a2").checked = result["custom"]["love"]["a2"];

    document.getElementById('displayDiv1').innerText = result["custom"]["trust"];
    document.getElementById('displayDiv2').innerText = result["custom"]["accept"];

    document.getElementById("nickname").value = result["name"];
    document.getElementById("secret").value = result["secret"];

    document.getElementById("enableCheck").checked = result["enable"];
    document.getElementById("show-flags").checked = result["show_flags"];
    document.getElementById("show-panel").checked = result["show_panel"];

    try {
        side_select.value = result["side"]
    } catch (e) {
        console.log(e)
    }

    mode = result["mode"];
    updateDisplay(mode);
    mode_select.value = result["mode"];
});

checkboxes = document.querySelectorAll("input[type=checkbox]");
for (i = 0; i < checkboxes.length; ++i) {
    checkboxes[i].addEventListener("click", function () {
        savePopupSettings();
    });
}

function savePopupSettings() {
    let new_bool = {
        "custom": {
            "love": {
                "y1": document.getElementById("love-y1").checked,
                "y2": document.getElementById("love-y2").checked,
                "a1": document.getElementById("love-a1").checked,
                "a2": document.getElementById("love-a2").checked
            },
            "fine": {
                "y1": document.getElementById("fine-y1").checked,
                "y2": document.getElementById("fine-y2").checked,
                "a1": document.getElementById("fine-a1").checked,
                "a2": document.getElementById("fine-a2").checked
            },
            "hate": {
                "y1": document.getElementById("hate-y1").checked,
                "y2": document.getElementById("hate-y2").checked,
                "a1": document.getElementById("hate-a1").checked,
                "a2": document.getElementById("hate-a2").checked
            },
            "trust": +document.getElementById('displayDiv1').innerText,
            "accept": +document.getElementById('displayDiv2').innerText
        },
        "show_flags": document.getElementById("show-flags").checked,
        "show_panel": document.getElementById("show-panel").checked,
        "enable": document.getElementById("enableCheck").checked
    }
    chrome.storage.sync.set(new_bool);
}


document.getElementById("switchButtonAction1").addEventListener("click", function () {
    if (document.getElementById("blockSettings").style.display.includes("block")) {
        document.getElementById("blockSettings").style.display = "none"
        document.getElementById("blockSecret").style.display = "block"
        document.getElementById("switchButtonAction1").innerHTML = "<img class='icon' src='img/popup/home.svg'>"
        document.getElementById("note_the_alpha").style.display = "none"
        document.getElementById("links").style.display = "none"
        document.getElementById("acceptable_table").style.display = "none"
        document.getElementById("trust_table").style.display = "none"

        document.getElementById("switchButtonAction2").style.display = "none"
        document.getElementById("switchButtonAction3").style.display = "none"

    } else {
        document.getElementById("blockSecret").style.display = "none"
        document.getElementById("blockSettings").style.display = "block"
        document.getElementById("switchButtonAction1").innerHTML = "<img class='icon' src='img/popup/cog.svg'>"
        document.getElementById("note_the_alpha").style.display = ""
        document.getElementById("links").style.display = ""
        if (mode === 5) {
            document.getElementById("acceptable_table").style.display = ""
            document.getElementById("trust_table").style.display = ""
        }
        document.getElementById("whitelist").style.display = "none"
        document.getElementById("stats").style.display = "none"

        document.getElementById("switchButtonAction2").style.display = ""
        document.getElementById("switchButtonAction3").style.display = ""
    }
})


document.getElementById("switchButtonAction3").addEventListener("click", function () {
    document.getElementById("switchButtonAction1").focus()
    document.getElementById("switchButtonAction1").innerHTML = "<img class='icon' src='img/popup/home.svg'>"
    document.getElementById("note_the_alpha").style.display = "none"
    document.getElementById("links").style.display = "none"
    document.getElementById("blockSettings").style.display = "none"
    document.getElementById("acceptable_table").style.display = "none"
    document.getElementById("trust_table").style.display = "none"
    document.getElementById("whitelist").style.display = "block"
    document.getElementById("stats").style.display = "none"
    document.getElementById("switchButtonAction2").style.display = "none"
    document.getElementById("switchButtonAction3").style.display = "none"
})

function formatTime(time) {
    time = Math.round(time)

    const minutes = Math.floor(time / 60)
    let seconds = time - minutes * 60

    seconds = seconds < 10 ? '0' + seconds : seconds

    return minutes + 'm:' + seconds + 's'
}

document.getElementById("switchButtonAction2").addEventListener("click", function () {
    document.getElementById("switchButtonAction1").focus()
    document.getElementById("switchButtonAction1").innerHTML = "<img class='icon' src='img/popup/home.svg'>"
    document.getElementById("note_the_alpha").style.display = "none"
    document.getElementById("links").style.display = "none"
    document.getElementById("blockSettings").style.display = "none"
    document.getElementById("acceptable_table").style.display = "none"
    document.getElementById("trust_table").style.display = "none"
    document.getElementById("whitelist").style.display = "none"
    document.getElementById("stats").style.display = "block"
    document.getElementById("switchButtonAction2").style.display = "none"
    document.getElementById("switchButtonAction3").style.display = "none"

    $("#stats01")[0].innerText = "...";
    $("#stats02")[0].innerText = "...";
    $("#stats03")[0].innerText = "...";
    $("#stats04")[0].innerText = "...";
    $("#stats05")[0].innerText = "...";
    $("#stats06")[0].innerText = "...";

    chrome.storage.sync.get(["secret"], function (result) {
        $.getJSON(`${baseUrl}/api/v0/getPersonalStats`, "secret=" + result["secret"], function (data) {
            $("#stats01")[0].innerText = data["skips_for_count"];
            $("#stats02")[0].innerText = formatTime(data["skips_for_duration"]);
            $("#stats03")[0].innerText = data["actual_segments"];
            $("#stats04")[0].innerText = data["moderated_segments"];
            $("#stats05")[0].innerText = data["skips_from_count"];
            $("#stats06")[0].innerText = formatTime(data["skips_from_duration"]);
        });
    })
})

function secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s >= 0 ? s + (s === 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

/***********
 Animates element's number to new number with commas
 Parameters:
 stop (number): number to stop on
 commas (boolean): turn commas on/off (default is true)
 duration (number): how long in ms (default is 1000)
 ease (string): type of easing (default is "swing", others are avaiable from jQuery's easing plugin
 Examples:
 $("#div").animateNumbers(1234, false, 500, "linear"); // half second linear without commas
 $("#div").animateNumbers(1234, true, 2000); // two second swing with commas
 $("#div").animateNumbers(4321); // one second swing with commas
 This fully expects an element containing an integer
 If the number is within copy then separate it with a span and target the span
 Will work in appropriate inputs
 Inserts and accounts for commas during animation by default

 https://github.com/talmand/jquery-animate-numbers
 ***********/

!function (e) {
    e.fn.animateNumbers = function (t, a, n, l) {
        return this.each(function () {
            var i = e(this), r = i.is("input"),
                v = parseInt(r ? i.val().replace(/,/g, "") : i.text().replace(/,/g, "")),
                u = /(\d)(?=(\d\d\d)+(?!\d))/g;
            a = void 0 === a ? !0 : a, r && "number" === i[0].type && (a = !1), e({value: v}).animate({value: t}, {
                duration: void 0 === n ? 1e3 : n,
                easing: void 0 === l ? "swing" : l,
                step: function () {
                    r ? i.val(Math.floor(this.value)) : i.text(Math.floor(this.value)), a && (r ? i.val(i.val().replace(u, "$1,")) : i.text(i.text().replace(u, "$1,")))
                },
                complete: function () {
                    (parseInt(i.text()) !== t || parseInt(i.val()) !== t) && (r ? i.val(t) : i.text(t), a && (r ? i.val(i.val().replace(u, "$1,")) : i.text(i.text().replace(u, "$1,"))))
                }
            })
        })
    }
}(jQuery);

function get_mini_stats() {
    $.getJSON(`${baseUrl}/api/v0/statsMini`, function (data) {
        $("#global_users").animateNumbers(data["global"]["users"], true, 2000);
        $("#global_segs").animateNumbers(data["global"]["reports"], true, 2000);
        $("#global_skips").animateNumbers(data["global"]["skips"], true, 2000);
        $("#global_moderated").animateNumbers(data["global"]["moderated"], true, 2000);
        $("#global_time").animateNumbers(data["global"]["duration"], true, 2000);

        chrome.storage.sync.set(
            {
                "stats": {
                    "global_users": data["global"]["users"],
                    "global_segs": data["global"]["reports"],
                    "global_skips": data["global"]["skips"],
                    "global_moderated": data["global"]["moderated"],
                    "global_time": data["global"]["duration"]
                }
            }
        );

        setTimeout(get_mini_stats, 2500); // <-- when you ge a response, call it
    });
}

chrome.storage.sync.get("stats", function (result) {
    $("#global_users")[0].innerText = result["stats"]["global_users"];
    $("#global_segs")[0].innerText = result["stats"]["global_segs"];
    $("#global_skips")[0].innerText = result["stats"]["global_skips"];
    $("#global_moderated")[0].innerText = result["stats"]["global_moderated"];
    $("#global_time")[0].innerText = result["stats"]["global_time"];
    get_mini_stats();
});

document.getElementById('switchSide').href = chrome.extension.getURL("wizard/wizard.html");
var whitelist = [];
document.getElementById("ukr").onclick = () => {chrome.tabs.create({url: chrome.i18n.getMessage("ukraineNotice")});}

function updateWhitelistTable() {
    chrome.storage.sync.get(["whitelist", "last_channel"], function (result) {
        whitelist = result["whitelist"];
        $("#list").empty();
        let list = []
        for (let item of result["whitelist"]) {
            if (!list.includes(item["cID"])) {
                $('#whitelistTable > tbody:last-child').append("<tr><td><small>" + item["cID"] + "</small></td><td><small>" + item["name"] + "</small></td><td><input type='button' class='RemoveRow' value='" + chrome.i18n.getMessage("RemoveRow") + "'></td></tr>");
                list.push(item["cID"])
            }
        }
        if (!list.includes(result["last_channel"]["cID"])) {
            $('#whitelistTable > tbody:last-child').append("<tr><td><small>" + result["last_channel"]["cID"] + "</small></td><td><small>" + result["last_channel"]["name"] + "</small></td><td><input type='button' class='AddNew' value='" + chrome.i18n.getMessage("AddRow") + "'></td></tr>");
        }
    })
}

updateWhitelistTable()
chrome.storage.onChanged.addListener(function (changes, namespace) {
    updateWhitelistTable()
});


$('table').on('click', '.AddNew', function () {
    whitelist.push({
        "cID": $(this).closest('tr')[0].childNodes[0].innerText,
        "name": $(this).closest('tr')[0].childNodes[1].innerText
    })
    chrome.storage.sync.set({"whitelist": whitelist});
});

$('table').on('click', '.RemoveRow', function () {
    let new_whitelist = [];
    let cid = $(this).closest('tr')[0].childNodes[0].innerText;
    for (let item of whitelist) {
        if (item["cID"] !== cid) {
            new_whitelist.push(item);
        }
    }
    chrome.storage.sync.set({"whitelist": new_whitelist});
});


function selectSide(id) {
    chrome.storage.sync.get(["secret"], function (result) {
            if (result["secret"] != null) {
                $.ajax
                ({
                    url: `${baseUrl}/api/v0/switchUserSide`,
                    type: "POST",
                    data: JSON.stringify({"secret": result["secret"], "side": id}),
                    contentType: 'application/json',
                    success: function (data) {
                        chrome.storage.sync.set({"side": data["side"]});
                    },
                    error: function (s, status, error) {
                        alert('error\n' + status + '\n' + error);
                    }
                })
            }
        }
    )
}

side_select.onchange = function () {
    selectSide(+side_select.value)
}

mode_select.onchange = function () {
    chrome.storage.sync.set({"mode": +mode_select.value});
    mode = +mode_select.value
    updateDisplay(mode)
}