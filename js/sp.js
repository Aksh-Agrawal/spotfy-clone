console.log("start");

let currentSong = new Audio();
let songs;
let currFolder;
function secondsToMMSS(seconds) {
  // Ensure seconds is an integer
  seconds = Math.floor(seconds);

  // Calculate minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Format minutes and seconds with leading zeros if necessary
  const minutesStr = String(minutes).padStart(2, "0");
  const secondsStr = String(remainingSeconds).padStart(2, "0");

  // Return the formatted string
  return `${minutesStr}:${secondsStr}`;
}

// Example usage:
const totalSeconds = 72.9; // Replace with your number of seconds
console.log(secondsToMMSS(totalSeconds)); // Outputs: "01:12"

async function getSongs(Folder) {
  currFolder = Folder;
  let a = await fetch(`/${Folder}/`);
  // add http://127.0.0.1:5500/ in fetch to make it work on browser
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${Folder}/`)[1]);
    }
  }
  let songUl = document
    .querySelector(".song-list")
    .getElementsByTagName("ul")[0];
  songUl.innerHTML = " ";
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li>

        <i class="fa-solid fa-music"></i>
        <div class="info">
        <div>${song.replaceAll("%20", " ")}</div>
        <div>  Aksh        </div>
      </div>
      <div class="playnow">
        <span>Play Now</span>
        <i class="fa-solid fa-circle-play"></i>
      </div>  </li>`;
  }
}

const playMusic = (track, pause = false) => {
  // let audio = new Audio ("/songs/"+track)
  currentSong.src = `/${currFolder}/` + track;

  if (!pause) {
    currentSong.play();
    play.src = "AllSvg/pause.svg";
  }
  document.querySelector(".song-info").innerHTML = decodeURI(track).slice(
    0,
    -4
  );
  document.querySelector(".song-time").innerHTML = "00:00/00:00";
};

async function main() {
  // get song
  await getSongs("songs/Retro");
  playMusic(songs[0], true);

  // event lisiner to each song

  Array.from(
    document.querySelector(".song-list").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "AllSvg/pause.svg";
    } else {
      currentSong.pause();
      play.src = "AllSvg/play.svg";
    }
  });

  // liten time update eveent
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".song-time").innerHTML = `${secondsToMMSS(
      currentSong.currentTime
    )}/${secondsToMMSS(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Add an event listener to seekbar

  document.querySelector(".seek-bar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //event lisener amburger

  document.querySelector(".burger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  //event lisner to previous or next

  document.querySelector(".previous").addEventListener("click", () => {
    console.log("previous was clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  document.querySelector(".next").addEventListener("click", () => {
    console.log("next was clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 <= length + 2) {
      playMusic(songs[index + 1]);
    }
  });

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    console.log(e);
    e.addEventListener("click", async (item) => {
      console.log("hii");

      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    });
  });
}
main();
