// 获取所有专辑列表
async function fetchAlbums() {
    try {
        const response = await fetch('http://localhost:3000/api/albums');
        const albumsData = await response.json();
        displayAlbums(albumsData.data);
    } catch (error) {
        console.error('Error fetching albums:', error);
    }
}

// 显示专辑列表
function displayAlbums(albums) {
    console.log("Albums data:", albums); // 调试输出，查看专辑数据
    const albumsContainer = document.getElementById('albums');
    
    albums.forEach(album => {
        const albumElement = document.createElement('div');
        albumElement.classList.add('album');
        
        // 使用本地代理加载图片
        const proxiedCoverUrl = `http://localhost:3000/proxy-image?url=${encodeURIComponent(album.coverUrl)}`;

        albumElement.innerHTML = `
            <img src="${proxiedCoverUrl}" alt="${album.name}">
            <h2>${album.name}</h2>
            <p>${album.artistes.join(', ')}</p>
            <button onclick="fetchAlbumDetails('${album.cid}')">查看歌曲</button>
        `;
        
        albumsContainer.appendChild(albumElement);
    });
}

// 获取单个专辑的详细信息
async function fetchAlbumDetails(albumId) {
    try {
        const response = await fetch(`http://localhost:3000/api/album/${albumId}/detail`);
        const albumDetailsData = await response.json();
        displayAlbumDetails(albumDetailsData.data);
    } catch (error) {
        console.error('Error fetching album details:', error);
    }
}

// 显示专辑详细信息和歌曲列表
function displayAlbumDetails(album) {
    console.log("Album details:", album); // 查看专辑的详细信息

    // 确保页面中的元素是有效的
    const albumContent = document.getElementById('albumContent');
    const songsList = document.getElementById('songsList');

    if (albumContent && songsList) {
        // 如果专辑封面图片 URL 存在，就使用代理加载图片
        const proxiedCoverDeUrl = album.coverDeUrl ? 
            `http://localhost:3000/proxy-image?url=${encodeURIComponent(album.coverDeUrl)}` : '';

        // 显示专辑封面、名称和介绍
        albumContent.innerHTML = `
            <img src="${proxiedCoverDeUrl}" alt="${album.name}" />
            <h3>${album.name}</h3>
            <p>${album.intro}</p>
        `;

        // 清空之前的歌曲列表内容
        songsList.innerHTML = '';

        // 确保歌曲列表存在并且有歌曲数据
        if (album.songs && album.songs.length > 0) {
            album.songs.forEach(song => {
                // 创建每个歌曲的元素
                const songElement = document.createElement('div');
                songElement.classList.add('song-item');
                songElement.innerHTML = `
                    <p>${song.name} - ${song.artistes.join(', ')}</p>
                    <button onclick="playSong('${song.cid}')">播放歌曲</button>
                `;
                // 将歌曲添加到歌曲列表中
                songsList.appendChild(songElement);
            });
        } else {
            // 如果没有歌曲，显示提示信息
            songsList.innerHTML = "<p>No songs available</p>";
        }

        // 打开侧边栏
        toggleSidebar();
    } else {
        console.error("Error: albumContent or songsList element not found in the DOM.");
    }
}

// 显示/隐藏侧边栏
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// 获取单个歌曲并播放
async function playSong(songId) {
    try {
        const response = await fetch(`http://localhost:3000/api/song/${songId}`);
        const songData = await response.json();

        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = songData.data.sourceUrl;
        audioPlayer.play();

        console.log('Lyric URL:', songData.data.lyricUrl); // 调试输出歌词链接
    } catch (error) {
        console.error('Error fetching song details:', error);
    }
}

// 初始化时获取并显示专辑列表
fetchAlbums();
