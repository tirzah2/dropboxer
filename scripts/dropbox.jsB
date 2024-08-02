// Load Dropbox SDK dynamically
const script = document.createElement('script');
script.src = "https://unpkg.com/dropbox/dist/Dropbox-sdk.min.js";
document.head.appendChild(script);

script.onload = () => {
  console.log("Dropbox SDK loaded.");

  // Load and render the template before initializing the Dropbox browser
  async function loadTemplateAndInitialize() {
    const templatePath = "modules/dropboxer/templates/dropbox-browser.hbs";
    const html = await renderTemplate(templatePath);
  
    // Create a dialog to hold the template content
    new Dialog({
      title: "Dropbox Browser",
      content: html,
      buttons: {
        close: {
          label: "Close",
          callback: () => {}
        }
      },
      render: async function () {
        // Initialize Dropbox Browser after the dialog is rendered
        await initializeDropboxBrowser();
      },
      // Set the dialog dimensions
      options: {
        width: 780,
        height: 500
      }
    }).render(true, {height: 500, width: 780, resizable: true});
  }
  
  // Define a function to browse Dropbox files
  async function fetchDropboxContents(path = '/gogots') {
    const dropbox = new Dropbox.Dropbox({ accessToken: 'sl.u.AFJkKkkSdJq2Y-uaDBDgnXAzbzuaD_AIeHWzkw_ddIbitqmMOyqMyNNsIWvcrOrwmF-Jvx_PoQkGaxxyBaA7lDWHLqZG9H1UIALWqbAYgm48CooxLNUR5tQp0hSzQdJ35kfd3PN5z1oJNx0OUukhm8YRRhpOGuZWzewcN6eid9977mvZQrDs0gm84783bLpfw5rEmoLEvmvnoKcx4pYR0Z1w6--RVXE8XmNWKhXPsUUaBplqGpDDrbLMlZhkCKHxagOhbOljDqy1U-24XAh3kXUghFBbpdK9tWKs9yaStNLOfwcIxG7DUEgC-Iy0-yKh5_1_htLIEG4RVx_gzdo8XYZs-4IIvTw7_xRBTOHBL4iswSLNaskBM83siBw9i2TgpzIhg6KSq7aXJw0AlH89hUXXGk7H5pjk_efIIOFj3n9w8vnOXT_1TmHQUDSd0WJvyxazaGh8o09prCt4ULJXDoNuJ_mcoUHgmm1K9hh6fWMD4kM4GSvaa8DzRO8KhRlMjl70oDMRf1U7LrNb7u5MCo3Ojp9_Ok9t8w0Tf-5BRV6LdNHOzcj78BgegEzgWTAjvIf-tF5oLdpLTHPEdq7LAhuAyYoz_FjwFTLvxEr4MJ5z_JVGyiP4K4qzf9BLjDZRHSL3PNt0Q6iMc-bsTBb8iEHyYzyGygd-YHKfrbsytVXVSRvZLlQlZXhNZ6MppCs264dOnnXuhXCAyPJWvZEzO0nBGqnLG70szsKY5qbg9LJhNWA8WIOEfC1-aTnXXWD6ksOofINlyVjsSafkwaodvVauxWzinAxFL_K220p5dyw2LkzVgynyXczM04U5Q5XA8cxz-xekz_AAe7m_rmR8W1csD1vS1n6O2pQ0yFUfxIuI0xV4vnvM6QJWQ25pj13FNSFy4Oula8ZMx5LWRUqncIWEF4mlNcHbRoTmpH-wXCBNtr2zvhOA_TPVkAwnmH0PToyAjSfHXeGwuSP3TKjBcFE4Dz7APLxN3m79HUoAJw59U1Xty6t0Gb1EJTHVWvuIDbM5NEiTKH3UR5YFWAulQgIAZC8CJBvvV_wik8_QHfywV2OvafZm7WxI7OwWHbGYZa2uXpbtxjHgas8wvK9qMjPK-Aj2_HU8Lms-54ay-toQ-NRuDEgObWdcWaXkScjJRV8X7ub2Eri6m_E0sEdytx11rAyqKYVIfLaRrPBubwc4Y2Y-syRTF56uoPByCYa6c695hT62AqIFI-hLuKcSNUqttBt1VSiEc24gigDu2oO9mZB_FjJW58-XORJXBSnpOPWyHlfThLoGX-Y-dwSvIvlvB73K6Ogmdb7ONDGehJuWxw' });

 
    try {
      console.log(`Fetching contents for path: ${path}`);
      const response = await dropbox.filesListFolder({ path: path });
      console.log("Dropbox API Response:", response.result.entries);
      return response.result.entries;
    } catch (error) {
      console.error('Error accessing Dropbox:', error.message || error);
      if (error.status === 401) {
        alert('Unauthorized: Please check your access token.');
      }
      return [];
    }
  }

  // Initialize the Dropbox browser
  async function initializeDropboxBrowser() {
    const rootContents = await fetchDropboxContents();
  
    if (rootContents.length > 0) {
      console.log('Root contents:', rootContents);
      renderFolderTree(rootContents, '#folderTree');
      displayFolderContents(rootContents);
    } else {
      console.error('No contents available or unauthorized access.');
    }
  
    // Click handler for folders
    const folderTree = document.querySelector('#folderTree');
    if (folderTree) {
      folderTree.addEventListener('click', async (event) => {
        if (event.target.classList.contains('folder-item')) {
          const folderPath = event.target.dataset.path;
          console.log(`Clicked folder: ${folderPath}`);
          const folderContents = await fetchDropboxContents(folderPath);
  
          // Display subfolders and images
          renderFolderTree(folderContents, '#folderTree');
          displayFolderContents(folderContents);
  
          // Update the current folder path (for the back button)
          currentFolderPath = folderPath;
        }
      });
    } else {
      console.error('Folder tree container not found.');
    }
  }
  

  // Render the folder tree
  function renderFolderTree(contents, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) {
      console.error('Container for folder tree not found.');
      return;
    }
    console.log('Rendering folder tree:', contents);
    container.innerHTML = '';

    contents.forEach(item => {
      if (item['.tag'] === 'folder') {
        const folderElement = document.createElement('div');
        folderElement.classList.add('folder-item');
        folderElement.dataset.path = item.path_lower;
        folderElement.innerText = item.name;

        container.appendChild(folderElement);
      }
    });
  }

  let currentFolderPath = '';

async function initializeDropboxBrowser() {
  const rootContents = await fetchDropboxContents();

  if (rootContents.length > 0) {
    console.log('Root contents:', rootContents);
    renderFolderTree(rootContents, '#folderTree');
    displayFolderContents(rootContents);
    currentFolderPath = ''; // Root path
  } else {
    console.error('No contents available or unauthorized access.');
  }

  // Click handler for folders
  const folderTree = document.querySelector('#folderTree');
  if (folderTree) {
    folderTree.addEventListener('click', async (event) => {
      if (event.target.classList.contains('folder-item')) {
        const folderPath = event.target.dataset.path;
        console.log(`Clicked folder: ${folderPath}`);
        const folderContents = await fetchDropboxContents(folderPath);

        // Display subfolders and images
        renderFolderTree(folderContents, '#folderTree');
        displayFolderContents(folderContents);

        // Update the current folder path and show the back button
        currentFolderPath = folderPath;
        document.getElementById('backButton').style.display = 'inline-block';
      }
    });
  } else {
    console.error('Folder tree container not found.');
  }

  // Back button handler
  const backButton = document.getElementById('backButton');
  if (backButton) {
    backButton.addEventListener('click', async () => {
      // Go up one directory level
      const parentFolderPath = currentFolderPath.substring(0, currentFolderPath.lastIndexOf('/'));
      const folderContents = await fetchDropboxContents(parentFolderPath);

      // Display subfolders and images
      renderFolderTree(folderContents, '#folderTree');
      displayFolderContents(folderContents);

      // Update the current folder path
      currentFolderPath = parentFolderPath;

      // Hide the back button if we are at the root level
      if (!currentFolderPath) {
        backButton.style.display = 'none';
      }
    });
  }
}

  // Display files with thumbnails in the image viewer
  async function displayFolderContents(contents) {
    const imageContainer = document.querySelector('#imageViewer');
    if (!imageContainer) {
      console.error('Image viewer container not found.');
      return;
    }
    imageContainer.innerHTML = '';
    
    // Filter out image files and prepare for thumbnail retrieval
    const imageFiles = contents.filter(item => item['.tag'] === 'file' && item.name.match(/\.(jpg|jpeg|png|gif|webp)$/i));
    if (imageFiles.length === 0) return;
    
    // Prepare the batch thumbnail request
    const dropbox = new Dropbox.Dropbox({ accessToken: 'sl.u.AFJkKkkSdJq2Y-uaDBDgnXAzbzuaD_AIeHWzkw_ddIbitqmMOyqMyNNsIWvcrOrwmF-Jvx_PoQkGaxxyBaA7lDWHLqZG9H1UIALWqbAYgm48CooxLNUR5tQp0hSzQdJ35kfd3PN5z1oJNx0OUukhm8YRRhpOGuZWzewcN6eid9977mvZQrDs0gm84783bLpfw5rEmoLEvmvnoKcx4pYR0Z1w6--RVXE8XmNWKhXPsUUaBplqGpDDrbLMlZhkCKHxagOhbOljDqy1U-24XAh3kXUghFBbpdK9tWKs9yaStNLOfwcIxG7DUEgC-Iy0-yKh5_1_htLIEG4RVx_gzdo8XYZs-4IIvTw7_xRBTOHBL4iswSLNaskBM83siBw9i2TgpzIhg6KSq7aXJw0AlH89hUXXGk7H5pjk_efIIOFj3n9w8vnOXT_1TmHQUDSd0WJvyxazaGh8o09prCt4ULJXDoNuJ_mcoUHgmm1K9hh6fWMD4kM4GSvaa8DzRO8KhRlMjl70oDMRf1U7LrNb7u5MCo3Ojp9_Ok9t8w0Tf-5BRV6LdNHOzcj78BgegEzgWTAjvIf-tF5oLdpLTHPEdq7LAhuAyYoz_FjwFTLvxEr4MJ5z_JVGyiP4K4qzf9BLjDZRHSL3PNt0Q6iMc-bsTBb8iEHyYzyGygd-YHKfrbsytVXVSRvZLlQlZXhNZ6MppCs264dOnnXuhXCAyPJWvZEzO0nBGqnLG70szsKY5qbg9LJhNWA8WIOEfC1-aTnXXWD6ksOofINlyVjsSafkwaodvVauxWzinAxFL_K220p5dyw2LkzVgynyXczM04U5Q5XA8cxz-xekz_AAe7m_rmR8W1csD1vS1n6O2pQ0yFUfxIuI0xV4vnvM6QJWQ25pj13FNSFy4Oula8ZMx5LWRUqncIWEF4mlNcHbRoTmpH-wXCBNtr2zvhOA_TPVkAwnmH0PToyAjSfHXeGwuSP3TKjBcFE4Dz7APLxN3m79HUoAJw59U1Xty6t0Gb1EJTHVWvuIDbM5NEiTKH3UR5YFWAulQgIAZC8CJBvvV_wik8_QHfywV2OvafZm7WxI7OwWHbGYZa2uXpbtxjHgas8wvK9qMjPK-Aj2_HU8Lms-54ay-toQ-NRuDEgObWdcWaXkScjJRV8X7ub2Eri6m_E0sEdytx11rAyqKYVIfLaRrPBubwc4Y2Y-syRTF56uoPByCYa6c695hT62AqIFI-hLuKcSNUqttBt1VSiEc24gigDu2oO9mZB_FjJW58-XORJXBSnpOPWyHlfThLoGX-Y-dwSvIvlvB73K6Ogmdb7ONDGehJuWxw' });
    const thumbnailRequests = imageFiles.map(file => ({
      path: file.path_lower,
      size: 'w256h256'
    }));
    
    try {
      const thumbnailResponse = await dropbox.filesGetThumbnailBatch({ entries: thumbnailRequests });
      console.log("Thumbnail Batch Response:", thumbnailResponse);
    
      thumbnailResponse.result.entries.forEach(entry => {
        if (entry.metadata && entry.thumbnail) {
          const imgElement = document.createElement('img');
          imgElement.src = `data:image/jpeg;base64,${entry.thumbnail}`;
          imgElement.alt = entry.metadata.name;
          imgElement.dataset.path = entry.metadata.path_lower; // Store the path for later use
          imgElement.classList.add('clickable-thumbnail'); // Add a class for click events
          imageContainer.appendChild(imgElement);
        }
      });
    
      // Add click event listeners to the thumbnails
      document.querySelectorAll('.clickable-thumbnail').forEach(img => {
        img.addEventListener('click', async (event) => {
          const path = event.currentTarget.dataset.path;
          console.log("Path received for creating a scene:", path); // Debugging line
      
          // Fetch file metadata to get details such as dimensions and name
          const fileInfo = await fetchFileMetadata(path);
      
          // Check if fileInfo is valid and correctly access the nested properties
          if (!fileInfo || !fileInfo.result || !fileInfo.result.name) {
            console.error("Failed to retrieve valid file info for scene creation.");
            ui.notifications.error("Failed to retrieve valid file info for scene creation.");
            return;
          }
      
          const fileName = fileInfo.result.name;
          const dimensions = fileInfo.result.media_info?.metadata?.dimensions || { width: 4000, height: 3000 };
      
          // Generate the direct download link
          const directDownloadLink = await convertToDirectDownload(path);
          if (!directDownloadLink) {
            ui.notifications.error("Failed to generate direct download link.");
            return;
          }
      
          // Prompt to create a scene using the direct download link
          new Dialog({
            title: "Create Scene",
            content: `<p>Would you like to create a scene with the background "${fileName}"?</p>`,
            buttons: {
              yes: {
                label: "Yes",
                callback: async () => {
                  await createSceneWithBackground(fileName, directDownloadLink, dimensions.width, dimensions.height);
                }
              },
              no: {
                label: "No",
                callback: () => {}
              }
            }
          }).render(true);
        });
      });
      
    
    } catch (error) {
      console.error('Error retrieving thumbnails:', error.message || error);
    }
  }
  
// Function to convert Dropbox path to a direct download link
async function convertToDirectDownload(path) {
  console.log("Path received for conversion:", path); // Debugging line

  const dropbox = new Dropbox.Dropbox({ accessToken: 'sl.u.AFJkKkkSdJq2Y-uaDBDgnXAzbzuaD_AIeHWzkw_ddIbitqmMOyqMyNNsIWvcrOrwmF-Jvx_PoQkGaxxyBaA7lDWHLqZG9H1UIALWqbAYgm48CooxLNUR5tQp0hSzQdJ35kfd3PN5z1oJNx0OUukhm8YRRhpOGuZWzewcN6eid9977mvZQrDs0gm84783bLpfw5rEmoLEvmvnoKcx4pYR0Z1w6--RVXE8XmNWKhXPsUUaBplqGpDDrbLMlZhkCKHxagOhbOljDqy1U-24XAh3kXUghFBbpdK9tWKs9yaStNLOfwcIxG7DUEgC-Iy0-yKh5_1_htLIEG4RVx_gzdo8XYZs-4IIvTw7_xRBTOHBL4iswSLNaskBM83siBw9i2TgpzIhg6KSq7aXJw0AlH89hUXXGk7H5pjk_efIIOFj3n9w8vnOXT_1TmHQUDSd0WJvyxazaGh8o09prCt4ULJXDoNuJ_mcoUHgmm1K9hh6fWMD4kM4GSvaa8DzRO8KhRlMjl70oDMRf1U7LrNb7u5MCo3Ojp9_Ok9t8w0Tf-5BRV6LdNHOzcj78BgegEzgWTAjvIf-tF5oLdpLTHPEdq7LAhuAyYoz_FjwFTLvxEr4MJ5z_JVGyiP4K4qzf9BLjDZRHSL3PNt0Q6iMc-bsTBb8iEHyYzyGygd-YHKfrbsytVXVSRvZLlQlZXhNZ6MppCs264dOnnXuhXCAyPJWvZEzO0nBGqnLG70szsKY5qbg9LJhNWA8WIOEfC1-aTnXXWD6ksOofINlyVjsSafkwaodvVauxWzinAxFL_K220p5dyw2LkzVgynyXczM04U5Q5XA8cxz-xekz_AAe7m_rmR8W1csD1vS1n6O2pQ0yFUfxIuI0xV4vnvM6QJWQ25pj13FNSFy4Oula8ZMx5LWRUqncIWEF4mlNcHbRoTmpH-wXCBNtr2zvhOA_TPVkAwnmH0PToyAjSfHXeGwuSP3TKjBcFE4Dz7APLxN3m79HUoAJw59U1Xty6t0Gb1EJTHVWvuIDbM5NEiTKH3UR5YFWAulQgIAZC8CJBvvV_wik8_QHfywV2OvafZm7WxI7OwWHbGYZa2uXpbtxjHgas8wvK9qMjPK-Aj2_HU8Lms-54ay-toQ-NRuDEgObWdcWaXkScjJRV8X7ub2Eri6m_E0sEdytx11rAyqKYVIfLaRrPBubwc4Y2Y-syRTF56uoPByCYa6c695hT62AqIFI-hLuKcSNUqttBt1VSiEc24gigDu2oO9mZB_FjJW58-XORJXBSnpOPWyHlfThLoGX-Y-dwSvIvlvB73K6Ogmdb7ONDGehJuWxw' });
  try {
    // First, try to list existing shared links for the file
    const sharedLinksResponse = await dropbox.sharingListSharedLinks({
      path: path,
      direct_only: true
    });

    let url;
    if (sharedLinksResponse.result.links.length > 0) {
      // If a shared link already exists, use it
      url = sharedLinksResponse.result.links[0].url;
    } else {
      // If no shared link exists, create a new one
      const newSharedLinkResponse = await dropbox.sharingCreateSharedLinkWithSettings({
        path: path
      });
      url = newSharedLinkResponse.result.url;
    }

    // Convert the shared link to a direct download link
    console.log("Shared link before conversion:", url); // Debugging line
    url = url.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace("?dl=0", "");
    console.log("Direct download link:", url); // Debugging line
    return url;
  } catch (error) {
    console.error("Failed to convert to direct download link:", error.message);
    return null;
  }
}


  
  // Function to fetch file metadata from Dropbox
  async function fetchFileMetadata(path) {
    const dropbox = new Dropbox.Dropbox({ accessToken: 'sl.u.AFJkKkkSdJq2Y-uaDBDgnXAzbzuaD_AIeHWzkw_ddIbitqmMOyqMyNNsIWvcrOrwmF-Jvx_PoQkGaxxyBaA7lDWHLqZG9H1UIALWqbAYgm48CooxLNUR5tQp0hSzQdJ35kfd3PN5z1oJNx0OUukhm8YRRhpOGuZWzewcN6eid9977mvZQrDs0gm84783bLpfw5rEmoLEvmvnoKcx4pYR0Z1w6--RVXE8XmNWKhXPsUUaBplqGpDDrbLMlZhkCKHxagOhbOljDqy1U-24XAh3kXUghFBbpdK9tWKs9yaStNLOfwcIxG7DUEgC-Iy0-yKh5_1_htLIEG4RVx_gzdo8XYZs-4IIvTw7_xRBTOHBL4iswSLNaskBM83siBw9i2TgpzIhg6KSq7aXJw0AlH89hUXXGk7H5pjk_efIIOFj3n9w8vnOXT_1TmHQUDSd0WJvyxazaGh8o09prCt4ULJXDoNuJ_mcoUHgmm1K9hh6fWMD4kM4GSvaa8DzRO8KhRlMjl70oDMRf1U7LrNb7u5MCo3Ojp9_Ok9t8w0Tf-5BRV6LdNHOzcj78BgegEzgWTAjvIf-tF5oLdpLTHPEdq7LAhuAyYoz_FjwFTLvxEr4MJ5z_JVGyiP4K4qzf9BLjDZRHSL3PNt0Q6iMc-bsTBb8iEHyYzyGygd-YHKfrbsytVXVSRvZLlQlZXhNZ6MppCs264dOnnXuhXCAyPJWvZEzO0nBGqnLG70szsKY5qbg9LJhNWA8WIOEfC1-aTnXXWD6ksOofINlyVjsSafkwaodvVauxWzinAxFL_K220p5dyw2LkzVgynyXczM04U5Q5XA8cxz-xekz_AAe7m_rmR8W1csD1vS1n6O2pQ0yFUfxIuI0xV4vnvM6QJWQ25pj13FNSFy4Oula8ZMx5LWRUqncIWEF4mlNcHbRoTmpH-wXCBNtr2zvhOA_TPVkAwnmH0PToyAjSfHXeGwuSP3TKjBcFE4Dz7APLxN3m79HUoAJw59U1Xty6t0Gb1EJTHVWvuIDbM5NEiTKH3UR5YFWAulQgIAZC8CJBvvV_wik8_QHfywV2OvafZm7WxI7OwWHbGYZa2uXpbtxjHgas8wvK9qMjPK-Aj2_HU8Lms-54ay-toQ-NRuDEgObWdcWaXkScjJRV8X7ub2Eri6m_E0sEdytx11rAyqKYVIfLaRrPBubwc4Y2Y-syRTF56uoPByCYa6c695hT62AqIFI-hLuKcSNUqttBt1VSiEc24gigDu2oO9mZB_FjJW58-XORJXBSnpOPWyHlfThLoGX-Y-dwSvIvlvB73K6Ogmdb7ONDGehJuWxw' });
    try {
      const response = await dropbox.filesGetMetadata({
        path: path,
        include_media_info: true
      });
      return response;
    } catch (error) {
      console.error("Failed to fetch file metadata:", error.message);
      return null;
    }
  }
  
  async function createSceneWithBackground(sceneName, backgroundUrl, width, height) {
    try {
      const newScene = await Scene.create({
        name: sceneName,  // Use the correct scene name
        img: backgroundUrl,  // Use the direct download link for the scene background
        width: width,
        height: height,
        grid: 100,
      });
  
      ui.notifications.info(`Scene "${newScene.name}" created with background: ${backgroundUrl}`);
    } catch (error) {
      console.error("Failed to create scene:", error);
      ui.notifications.error("Failed to create scene. Please check the console for details.");
    }
  }
  
  // Register the console command to open Dropbox browser
  window.openDropboxBrowser = loadTemplateAndInitialize;

  console.log("Dropbox browser command registered. Use 'openDropboxBrowser()' in the console.");
};