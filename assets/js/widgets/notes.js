(function() {
    var ns = document.querySelector("section.notes");
    var login = ns.getAttribute("data-login");
    var ul = ns.querySelector("ul");

    function updateNotes() {
        API("GET", "getNotes", {"login": login}, function(err, notes) {
            if (err) return flash(err);
            var frag = document.createDocumentFragment();
            notes.rows.forEach(function(n) {
                var li = document.createElement("li");
                var a = document.createElement("a");
                a.appendChild(document.createTextNode("×"));
                a.href = "#";
                a.onclick = function(e) {
                    e.preventDefault();
                    API("POST", "removeNote", {id: n.id}, function(err, res) {
                        if (err) return flash("Couldn't delete note", err);
                        if (!res.success) { return flash("Couldn't save note", res.msg); }
                        updateNotes();
                    })
                }
                li.appendChild(document.createTextNode(n.note + " "));
                li.appendChild(a);
                frag.appendChild(li);
            })
            ul.innerHTML = "";
            ul.appendChild(frag);
        })
    }

    ns.querySelector("button").onclick = function() {
        var n = prompt("Add a note?");
        if (n) {
            API("POST", "addNote", {login: login, note: n}, function(err, res) {
                if (err) { return flash("Couldn't save note", err); }
                if (!res.success) { return flash("Couldn't save note", res.msg); }
                updateNotes();
            })
        }
    }
    document.addEventListener("DOMContentLoaded", updateNotes, false);
})();