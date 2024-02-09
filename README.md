# Profile Saver

This is a simple desktop application to manage and store discord profiles, so that you may retrieve and reuse them.

## Features ⭐

- Familiar and simple UI inspired by discord
- Import your current profile directly with discord API
- Create entirely unique profiles locally, no need to use discord
- Manage all your profiles easily by using collections
- Quickly retrieve past profiles colors, about me, banner image, and avatar image
- Supports both pngs and gifs
- No need to sign into discord
- Privacy conscious by storing all profile data locally
- Fast, beautiful, and easy to use

## Installation 💾

Download and run the latest installer from [Releases](https://github.com/TheRealSavi/ProfileSaver/releases)

Or build and run locally with npm

```bash
  git clone https://github.com/TheRealSavi/ProfileSaver.git
  cd ProfileSaver
  npm install

  npm run electron:dev //developer mode
  npm run app:build //compile binaries

```

## Screenshots 📷

| 🏠 Home Page                                                                                | ✏️ Creation Page                                                                            |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| ![Image 1](https://github.com/TheRealSavi/ProfileSaver/blob/master/public/ss1.png?raw=true) | ![Image 2](https://github.com/TheRealSavi/ProfileSaver/blob/master/public/ss2.png?raw=true) |

## Storage 💽

Profiles, collections, and user defined preferences are stored in.
Be sure to back up these directories if you want to keep them in the event of an erase.

```
%appdata%\profilesaver\profiles\
%appdata%\profilesaver\collections\
%appdata%\profilesaver\settings.json
```

## Project info ⚙️

The idea for this project was to make a beautiful and server-less windows application to keep track of discord profiles.

Some challenges I faced while developing this were that I wasnt sure how to approach storing user data.
I settled on storing the data using the os filesystem. However, if I were to revist this project, I think it would be nice to look into using some kind of database, or utilizing Electrons (Chromes) storage capabilities.

I also wanted to make sure that the application followed secure best practices and had a modern approach to the code.
This caused me some trouble when learning electron and finding out how to use the IPC and context bridge.
Ultimately, I am happy with the implementation of the IPC however I was unable to use proper typechecking for typescript for these API calls, due to a hasty approach with simply exposing the invoke method to the window. If I were to revist this, I would create multiple exposed methods to the window, so that I could define types for their parameters.

I also faced some issues when implementing framer-motion for the smooth movement of the profiles when opening the information panel, and when sorting them by collection. I had to change the structure of the where the animations were defined a few times to prevent flickering and overlapping elements.

Another interesting problem I ran into was handling, storing, and rendering the profile picture and banner, since the user has the option to select an image from their file system, or import it from the discord API. Because the frontend does not have access to the file system, simply using the file path to render the image was not an option. This meant that I had to convert the selected image to a data url which I would send to the frontend to be rendered.
When it comes to rendering these two possible states, a URL to the discord CDN, or a data URL, the HTML img tag has no issue rendering either, and since both are stored as a string, the type is consistent as well.
However a problem arose when having to then store the images when saving the profile.
To store the image from the discord API it's as simple as making an http request to the image URL and piping it to a file, and the file extention is provided by the API, since they are stored starting with a\_ when its a gif, and not when its a png.
But to store the data URL, I'd need to find out the file extention, which required breaking down the url, creating a buffer, checking the position that stores the data type, matching the hex to its extention, and then finally writing the buffer to the file system.
By doing this I was able to handle both cases and store the image data to the filesystem with the correct extention, no matter where it came from.

I learned a lot about Electron, Buffers, and CSS in this project.

#### Tech Stack

**Client:** React, TailwindCSS, Framer-Motion, Polished, TypeScript

**Server:** NodeJS, Electron, Electron-builder, Vite, JavaScript

Programmed using ES6 syntax

## Authors 👤

- [John Gibbons](https://www.github.com/TheRealSavi)

## License ⚖️

- [MIT](https://choosealicense.com/licenses/mit/)
