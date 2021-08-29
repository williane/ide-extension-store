const util = require("util");
const exec = util.promisify(require("child_process").exec);
const path = require("path");
const fs = require("fs");
const tar = require("tar-fs");
const axios = require("axios");

const inputFiles = document.querySelector("#file");
const filesChoosed = document.querySelector(".files-choosed");
const buttonGenerated = document.querySelector(".btn-genereted");
const logs = document.querySelector(".log");
const git = document.querySelector("#gitClone");
const loading = document.querySelector(".not-active");
const inputExtension = document.querySelector("#input_extension");
const gitCommit = document.querySelector("#git-commit");
const userId = document.querySelector("#user-id");
const selectInstance = document.querySelector('[name="instance"]');
const divFilesLoaded = document.querySelector(".files-loaded");
const buttonConclude = document.querySelector(".concluded");

const files = [];
const rolloutFile = [];
const repositorios = [];
const userName = process.env["USERPROFILE"].split(path.sep)[2];

userId.textContent = userName;

window.onload = () => {
  getRepositories();
};

inputFiles.addEventListener("change", () => {
  filesChoosed.textContent = "";
  Array.from(inputFiles.files).map((file) => {
    files.push(file);
  });
  fillDivFileChoosed(files);
});

buttonGenerated.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!selectInstance.selectedOptions[0]?.value) {
  } else if (filesChoosed.length < 1) {
  } else if (!gitCommit.value) {
  } else if (!inputExtension.value) {
  } else {
    logs.textContent = null;
    buttonGenerated.disabled = true;
    inputFiles.disabled = true;
    inputExtension.disabled = true;
    gitCommit.disabled = true;
    selectInstance.disabled = true;
    git.disabled = true;

    loading.classList.remove("not-active");
    await gitDados();
    loading.classList.add("not-active");

    divFilesLoaded.classList.remove("not-active");
  }
});

buttonConclude.addEventListener("click", (e) => {
  e.preventDefault();

  logs.textContent = null;
  files.length = 0;
  rolloutFile.length = 0;
  inputFiles.value = "";
  inputExtension.value = null;
  gitCommit.value = null;
  filesChoosed.textContent = null;

  buttonGenerated.disabled = false;
  inputFiles.disabled = false;
  inputExtension.disabled = false;
  gitCommit.disabled = false;
  selectInstance.disabled = false;
  git.disabled = false;

  divFilesLoaded.classList.add("not-active");
});

function fillDivFileChoosed(files) {
  files?.map((file) => {
    const divFileWrapper = document.createElement("div");
    const divFilePath = document.createElement("div");
    const divFileDeleted = document.createElement("div");
    const buttonDelete = document.createElement("button");

    divFileWrapper.classList.add("file-wrapper");
    divFilePath.classList.add("file-path");
    divFileDeleted.classList.add("file-delete");
    buttonDelete.id = "deleteFile";
    buttonDelete.name = file.path;

    divFilePath.textContent = file.path;
    buttonDelete.textContent = "X";

    divFileWrapper.appendChild(divFilePath);
    divFileDeleted.appendChild(buttonDelete);
    divFileWrapper.appendChild(divFileDeleted);
    filesChoosed.appendChild(divFileWrapper);

    buttonDelete.addEventListener("click", (e) => {
      e.preventDefault();
      filesChoosed.textContent = null;
      const newFiles = files.filter((file) => file.path != e.target.name);
      files.length = 0;
      files.push(...newFiles);
      fillDivFileChoosed(files);
    });
  });
}

function getRepositories() {
  let data = "";
  const config = {
    method: "get",
    url: "https://dev.azure.com/dhl-supply-chain/WMS/_apis/git/repositories?api-version=6.0",
    headers: {
      Authorization:
        "Basic Om13amN2a2dlNXZyNDNsZmFqd3ViYm4zcndxZzV3ZGZrZG1ubWQ1NW9ianJ3ZHJvank2dHE=",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      response.data.value.map((repository) => {
        repositorios.push(repository.name);
      });
      createInstanceOption();
    })
    .catch(function (error) {
      console.log(error);
    });
}

function createInstanceOption() {
  repositorios.forEach((repository) => {
    const option = document.createElement("option");
    option.value = repository;
    option.textContent = repository;
    selectInstance.appendChild(option);
  });
}

function insertLog(message) {
  const p = document.createElement("p");
  p.textContent = message;
  logs.appendChild(p);
}

function deleteFolderRecursive(caminho) {
  if (fs.existsSync(caminho)) {
    fs.readdirSync(caminho).forEach((file, index) => {
      const curPath = path.join(caminho, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(caminho);
  }
}

function creatFolderRootIfNotExist() {
  const folderRoot = "C:/Repositorios";
  const existsDirectory = fs.existsSync(folderRoot);
  insertLog("Validando se pasta de repositorios existe...");
  if (!existsDirectory) {
    insertLog("Criando pasta de repositorios C:/Repositorios...");
    fs.mkdirSync(folderRoot);
    insertLog("Pasta de repositorios C:/Repositorios criada com sucesso...");
  }
}

function validateFolderStructure(folders, directory) {
  let folderJoined = [];
  folders.map((folder) => {
    folderJoined.push(folder);
    const directoryComplete = path.join(directory, ...folderJoined);
    if (!fs.existsSync(directoryComplete)) {
      fs.mkdirSync(directoryComplete);
      insertLog(`Pasta ${directoryComplete} criada!`);
    }
  });
}

function createDefaultFolers(directory, extensionStore) {
  const reports = ["reports", "usrint"];
  const pageResource = ["data", "ws"];
  const commands = ["src", "cmdsrc", "usrint"];
  const dscmst = ["db", "data", "load", "base", "bootstraponly", "dscmst"];
  const rpt_config = [
    "db",
    "data",
    "load",
    "base",
    "bootstraponly",
    "rpt_config",
  ];

  const directoryExntension = path.join(directory, extensionStore);

  insertLog("Validando se existe pasta para a extension...");
  if (fs.existsSync(directoryExntension)) {
    insertLog("Removendo pasta antiga da Extension...");
    deleteFolderRecursive(directoryExntension);
    insertLog("Pasta removida com sucesso");
  }

  if (!fs.existsSync(directoryExntension)) {
    insertLog("Criando pasta para a extension...");
    fs.mkdirSync(directoryExntension);
    insertLog("Pasta da extension criada com sucesso!");
  }

  validateFolderStructure(reports, directory);
  validateFolderStructure(pageResource, directory);
  validateFolderStructure(commands, directory);
  validateFolderStructure(dscmst, directory);
  validateFolderStructure(rpt_config, directory);

  validateFolderStructure(reports, directoryExntension);
  validateFolderStructure(pageResource, directoryExntension);
  validateFolderStructure(commands, directoryExntension);
  validateFolderStructure(dscmst, directoryExntension);
  validateFolderStructure(rpt_config, directoryExntension);
}

function copyDefaultFiles(directoryExntension) {
  insertLog("Copiando arquivos padrões");
  fs.readdirSync(path.join(__dirname, "..", "defaultFiles"))
    .filter(
      (file) =>
        !fs
          .lstatSync(path.join(__dirname, "..", "defaultFiles", file))
          .isDirectory()
    )
    .map((file) => {
      const fromFile = path.join(__dirname, "..", "defaultFiles", file);
      const toFile = path.join(directoryExntension, file);
      fs.copyFileSync(fromFile, toFile);
      insertLog(`arquivo ${file} copiado`);
    });
}

function copyDefaultReportFiles(directoryExntension) {
  insertLog("Copiando arquivos padrões");
  const dscmst = ["db", "data", "load", "base", "bootstraponly", "dscmst"];
  const rpt_config = [
    "db",
    "data",
    "load",
    "base",
    "bootstraponly",
    "rpt_config",
  ];
  const dirDscmst = path.join(__dirname, "..", "defaultFiles", "dscmst");
  const dirRptConfig = path.join(__dirname, "..", "defaultFiles", "rpt_config");

  fs.readdirSync(dirDscmst)
    .filter((file) => !fs.lstatSync(path.join(dirDscmst, file)).isDirectory())
    .map((file) => {
      const fromFile = path.join(dirDscmst, file);
      const toFile = path.join(directoryExntension, ...dscmst, file);
      fs.copyFileSync(fromFile, toFile);
      insertLog(`arquivo ${file} copiado`);
    });

  fs.readdirSync(dirRptConfig)
    .filter(
      (file) => !fs.lstatSync(path.join(dirRptConfig, file)).isDirectory()
    )
    .map((file) => {
      const fromFile = path.join(dirRptConfig, file);
      const toFile = path.join(directoryExntension, ...rpt_config, file);
      fs.copyFileSync(fromFile, toFile);
      insertLog(`arquivo ${file} copiado`);
    });
}

function copyFiles(directory, fromFile, toFolder, file, git) {
  const toFile = path.join(directory, ...toFolder, file.name);
  fs.copyFileSync(fromFile, toFile);

  insertLog(`Arquivo ${file.name} copiado com sucesso!`);
  if (!git) {
    rolloutFile.push(
      `REPLACE ${path.join(...toFolder, file.name)} ${path.join(
        "$LESDIR",
        ...toFolder
      )}`
    );
  }
}

function identifyAndCopyFilesToExtensionFolder(directory, extensionStore) {
  const reports = ["reports", "usrint"];
  const pageResource = ["data", "ws"];
  const commands = ["src", "cmdsrc", "usrint"];
  const dscmst = ["db", "data", "load", "base", "bootstraponly", "dscmst"];
  const rpt_config = [
    "db",
    "data",
    "load",
    "base",
    "bootstraponly",
    "rpt_config",
  ];

  const directoryExntension = path.join(directory, extensionStore);

  insertLog("Copiando arquivos para a pasta da extension");

  files.map((file) => {
    const fromFile = file.path;

    if ([".jrxml"].includes(path.extname(file.name))) {
      copyDefaultReportFiles(directoryExntension);
      copyFiles(directoryExntension, fromFile, reports, file);
      copyFiles(directory, fromFile, reports, file, "GIT");
    } else if (["dscmst.csv"].includes(file.name)) {
      copyFiles(directoryExntension, fromFile, dscmst, file);
      rolloutFile.push(
        `REPLACE ${path.join(
          ...dscmst,
          "dscmst.ctl"
        )} $LESDIR/db/data/load/base/bootstraponly`
      );
      rolloutFile.push(
        `loaddata $LESDIR/db/data/load/base/bootstraponly/dscmst.ctl ${file.name}`
      );
    } else if (["rpt_config.csv"].includes(file.name)) {
      copyFiles(directoryExntension, fromFile, rpt_config, file);
      rolloutFile.push(
        `REPLACE ${path.join(
          ...rpt_config,
          "rpt_config.ctl"
        )} $LESDIR/db/data/load/base/bootstraponly`
      );
      rolloutFile.push(
        `loaddata $LESDIR/db/data/load/base/bootstraponly/rpt_config.ctl ${file.name}`
      );
    } else if ([".resource", ".action"].includes(path.extname(file.name))) {
      copyFiles(directoryExntension, fromFile, pageResource, file);
      copyFiles(directory, fromFile, pageResource, file, "GIT");
    } else if ([".mcmd"].includes(path.extname(file.name))) {
      copyFiles(directoryExntension, fromFile, commands, file);
      copyFiles(directory, fromFile, commands, file, "GIT");
    } else {
      insertLog(`Arquivo ${file.name} não identificado!`);
    }
  });

  copyDefaultFiles(directoryExntension);
}

function createRolloutFile(directory, extensionStore) {
  const directoryExntension = path.join(directory, extensionStore);

  insertLog("Criando arquivo de rollout");
  rolloutFile.map((text) => {
    const file = path.join(directoryExntension, extensionStore);
    fs.appendFileSync(
      `${file}`,
      `${text.toString().replace(/\\/g, "/")}
`
    );
  });
  insertLog("arquivo de rollout criado");
}

async function createTarFile(directory, extensionStore) {
  const directoryExntension = path.join(directory, extensionStore);
  insertLog("Validando se a pasta toserver existe");

  if (fs.existsSync(path.join(directory, "toserver"))) {
    insertLog("pasta toserver já existente");
    insertLog("Apagando extensions antigas");
    deleteFolderRecursive(path.join(directory, "toserver"));
  }
  fs.mkdirSync(path.join(directory, "toserver"));
  insertLog("Pasta toserver atualizada!");

  insertLog("Criando arquivo .tar");
  // tar
  //   .pack(directoryExntension)
  //   .pipe(
  //     fs.createWriteStream(
  //       path.join(directory, "toserver", `${extensionStore}.tar`)
  //     )
  //   );
  const directoryWindows = directory.replace(/\//g, "\\");
  try {
    stdout = await exec(
      `cmd /c ${path.join(
        __dirname,
        "..",
        "batchs",
        "tarFile.bat"
      )} "${directoryExntension.replace(
        "C:\\",
        ""
      )}" ${extensionStore} ${directoryWindows}`
    );
    insertLog(stdout.stderr);
  } catch (e) {
    insertLog(e.stderr);
  }
}

async function commitTarFile(directory, extensionStore, gitClone) {
  const messageCommit = gitCommit.value;
  const gitBranch = "develop";

  try {
    stdout = await exec(
      `cmd /c ${path.join(
        __dirname,
        "..",
        "batchs",
        "gitCommands.bat"
      )} "${directory.replace(
        "C:/",
        ""
      )}" "${messageCommit}" "${gitBranch}" "${gitClone}" "${extensionStore}"`
    );

    insertLog(stdout.stderr);
    insertLog(stdout.stdout);
  } catch (e) {
    insertLog(e.stderr);
  }
}

async function gitDados() {
  let stdout = "";

  const gitCloneComplete = git.value + selectInstance.selectedOptions[0]?.value;

  const gitClone = gitCloneComplete.split("@")[1];

  const gitRepo = gitClone.split("/")[gitClone.split("/").length - 1];
  const directory = `C:/Repositorios/${gitRepo}`;

  creatFolderRootIfNotExist();

  const existsDirectory = fs.existsSync(directory);
  insertLog("Processo Iniciado");

  if (existsDirectory) {
    insertLog("Repositorio já existente. Realizando git pull...");

    try {
      stdout = await exec(
        `cmd /c ${path.join(
          __dirname,
          "..",
          "batchs",
          "gitPull.bat"
        )} "${directory.replace("C:/", "")}" "${gitClone}"`
      );
      insertLog(stdout.stderr);
    } catch (e) {
      insertLog(e.stderr);
    }
  }

  if (!existsDirectory) {
    insertLog("Iniciando o git clone da branch Develop...");
    try {
      stdout = await exec(
        `cmd /c ${path.join(
          __dirname,
          "..",
          "batchs",
          "gitCloneDevelop.bat"
        )} "${gitClone}"`
      );
      insertLog(stdout.stderr);
    } catch (e) {
      insertLog(e.stderr);
      insertLog("Iniciando o git clone e criando a branch Develop...");
      try {
        stdout = await exec(
          `cmd /c ${path.join(
            __dirname,
            "..",
            "batchs",
            "gitClone.bat"
          )} "${gitClone}" "${gitRepo}"`
        );
        insertLog(stdout.stderr);
      } catch (e) {
        insertLog(e.stderr);
      }
    }
  }

  const extensionStore = inputExtension.value;

  createDefaultFolers(directory, extensionStore);

  identifyAndCopyFilesToExtensionFolder(directory, extensionStore);

  createRolloutFile(directory, extensionStore);

  await createTarFile(directory, extensionStore);

  await commitTarFile(directory, extensionStore, gitClone);
}
