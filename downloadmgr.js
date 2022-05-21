let url = new URL(location.href);
let spu;
let params = new URLSearchParams(url.search);
if (params.has("id"))
    spu = params.get("id");
else
    document.body.innerHTML = "Specificare un'URL Spotify come parametro GET";

let id = spu.split("playlist/")[1].split("?")[0];

function updateStatus(s) {
    document.querySelector("#status").innerHTML = s;
}

async function get_spoti_playlist(id) {
    let r = await fetch("https://www.mb-srv.tk/spotidlapi/spotify_playlist_info.php?id=" + id);
    let t = await r.text();
    return JSON.parse(t).items;
}
async function ricercayt(q) {
    q = encodeURIComponent(q).toLowerCase();
    let r = await fetch("https://www.mb-srv.tk/spotidlapi/ytsearch.php?q=" + q);
    return await r.text();
}
window.onload = async function () {
    document.body.style.overflow = "hidden";
    updateStatus("Recupero info sulla playlist...");
    let playlist = await get_spoti_playlist(id);
    updateStatus(`Trovate ${playlist.length} canzoni...`);
    let rowContent = "";
    let contaCol = 0;
    for (var i = 0; i < playlist.length; i++) {
        updateStatus(`Elaboro ${i + 1} di ${playlist.length}: Ricerco`);
        let nomeCanzone = playlist[i].track.name;
        let artista = playlist[i].track.artists[0].name;
        let imgUrl = playlist[i].track.album.images[1].url;
        document.querySelector("#imgCaric").src = imgUrl;
        document.querySelector("#canzoneCaric").innerHTML = nomeCanzone;
        document.querySelector("#artistaCaric").innerHTML = artista;
        let streamUrl = await ricercayt(nomeCanzone + " " + artista);
        updateStatus(`Trovata traccia audio per ${nomeCanzone} - ${artista}`);
        rowContent += `
                <div class='col-sm'>
                      <br>
                      <div class="card text-white bg-dark">
                      <img class="card-img-top" src="${imgUrl}">
                      <div class="card-body">
                        <h5 class="card-title">${nomeCanzone}</h5 >
                        <p class="card-text">${artista}</p>
                        <a href="${streamUrl}" class="btn btn-primary">Scarica...</a>
                      </div>
                    </div>
                    <br>
                </div>
            `;
        contaCol++;
        if (contaCol == 3) {
            document.getElementById("results").innerHTML += `<div class='row'>${rowContent}</div>`;
            updateStatus(`Gruppo concluso.`);
            rowContent = "";
            contaCol = 0;
        }
    }
    document.body.style.overflow = "auto";
    location.hash = "#results";
    document.querySelector("#main").style.display = "none";
}

/*
fetch("https://www.mb-srv.tk/spotidlapi/index.php?id=" + id)
    .then(r => r.text())
    .then(t => {
        let spl = t.split("\n");
        let rowContent = "";
        let contaCol = 0;
        for (var i = 0; i < spl.length; i++) {
            // 0-TITOLO;1-ARTISTA;2-URLAUDIO;3-URLIMMAGINE
            let splRiga = spl[i].split(";");
            urlArr.push(splRiga[2]);
            rowContent += `
                <div class='col-sm'>
                      <br>
                      <div class="card text-white bg-dark">
                      <img class="card-img-top" src="${splRiga[3]}">
                      <div class="card-body">
                        <h5 class="card-title">${splRiga[0]}</h5 >
                        <p class="card-text">${splRiga[1]}</p>
                        <a href="${splRiga[2]}" class="btn btn-primary">Scarica...</a>
                      </div>
                    </div>
                    <br>
                </div>
            `;
            contaCol++;
            if (contaCol == 3) {
                str += `<div class='row'>${rowContent}</div>`;
                rowContent = "";
                contaCol = 0;
            }
        }
        document.body.innerHTML = "<div class='container bg-primary'>" + str + "</div>";
    });*/