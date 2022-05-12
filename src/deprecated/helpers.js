import { CODE_VARIANTS } from "./constants";

/**
 * Mapping from the date adapter sub-packages to the npm packages they require.
 * @example `@mui/lab/AdapterDateFns` has a peer dependency on `date-fns`.
 */
const dateAdapterPackageMapping = {
  AdapterDateFns: "date-fns",
  AdapterDayjs: "dayjs",
  AdapterLuxon: "luxon",
  AdapterMoment: "moment",
};

/**
 * @var
 * set of packages that ship their own typings instead of using @types/ namespace
 * Array because Set([iterable]) is not supported in IE11
 */
const packagesWithBundledTypes = [
  "date-fns",
  "@emotion/react",
  "@emotion/styled",
];

/**
 * WARNING: Always uses `latest` typings.
 *
 * Adds dependencies to @types packages only for packages that are not listed
 * in packagesWithBundledTypes
 *
 * @see packagesWithBundledTypes in this module namespace
 * @param deps - list of dependency as `name => version`
 */
function addTypeDeps(deps) {
  const packagesWithDTPackage = Object.keys(deps)
    .filter((name) => packagesWithBundledTypes.indexOf(name) === -1)
    // All the MUI packages come with bundled types
    .filter((name) => name.indexOf("@mui/") !== 0);

  packagesWithDTPackage.forEach((name) => {
    let resolvedName = name;
    // scoped package?
    if (name.startsWith("@")) {
      // https://github.com/DefinitelyTyped/DefinitelyTyped#what-about-scoped-packages
      resolvedName = name.slice(1).replace("/", "__");
    }

    deps[`@types/${resolvedName}`] = "latest";
  });
}

function includePeerDependencies(deps, versions) {
  let newDeps = {
    ...deps,
    "react-dom": versions["react-dom"],
    react: versions.react,
    "@emotion/react": versions["@emotion/react"],
    "@emotion/styled": versions["@emotion/styled"],
  };

  if (newDeps["@mui/lab"]) {
    newDeps["@mui/material"] = versions["@mui/material"];
  }

  if (newDeps["@material-ui/data-grid"]) {
    newDeps["@mui/material"] = versions["@mui/material"];
    newDeps["@mui/styles"] = versions["@mui/styles"];
  }

  // TODO: Where is this coming from and why does it need to be injected this way.
  if (window.muiDocConfig) {
    newDeps = window.muiDocConfig.csbIncludePeerDependencies(newDeps, {
      versions,
    });
  }

  return newDeps;
}

/**
 * @param packageName - The name of a package living inside this repository.
 * @param commitRef
 * @return string - A valid version for a dependency entry in a package.json
 */
function getMuiPackageVersion(packageName, commitRef) {
  if (
    commitRef === undefined ||
    process.env.SOURCE_CODE_REPO !== "https://github.com/mui/material-ui"
  ) {
    // #default-branch-switch
    return "latest";
  }
  const shortSha = commitRef.slice(0, 8);
  return `https://pkg.csb.dev/mui/material-ui/commit/${shortSha}/@mui/${packageName}`;
}

/**
 * @param raw - ES6 source with es module imports
 * @param options
 * @returns map of packages with their required version
 */
export function getDependencies(raw, options = {}) {
  const { codeLanguage, muiCommitRef } = options;

  let deps = {};
  let versions = {
    react: "latest",
    "react-dom": "latest",
    "@emotion/react": "latest",
    "@emotion/styled": "latest",
    "@mui/material": getMuiPackageVersion("material", muiCommitRef),
    "@mui/icons-material": getMuiPackageVersion("icons-material", muiCommitRef),
    "@mui/lab": getMuiPackageVersion("lab", muiCommitRef),
    "@mui/styled-engine": getMuiPackageVersion("styled-engine", muiCommitRef),
    "@mui/styles": getMuiPackageVersion("styles", muiCommitRef),
    "@mui/system": getMuiPackageVersion("system", muiCommitRef),
    "@mui/private-theming": getMuiPackageVersion("theming", muiCommitRef),
    "@mui/private-classnames": getMuiPackageVersion("classnames", muiCommitRef),
    "@mui/base": getMuiPackageVersion("base", muiCommitRef),
    "@mui/utils": getMuiPackageVersion("utils", muiCommitRef),
    "@mui/material-next": getMuiPackageVersion("material-next", muiCommitRef),
    "@mui/joy": getMuiPackageVersion("joy", muiCommitRef),
  };

  // TODO: Where is this coming from and why does it need to be injected this way.
  if (window.muiDocConfig) {
    versions = window.muiDocConfig.csbGetVersions(versions, { muiCommitRef });
  }

  const re = /^import\s'([^']+)'|import\s[\s\S]*?\sfrom\s+'([^']+)/gm;
  let m = null;
  // eslint-disable-next-line no-cond-assign
  while ((m = re.exec(raw))) {
    const fullName = m[2] ?? m[1];
    // handle scope names
    const name =
      fullName.charAt(0) === "@"
        ? fullName.split("/", 2).join("/")
        : fullName.split("/", 1)[0];

    if (!deps[name]) {
      deps[name] = versions[name] ? versions[name] : "latest";
    }

    // e.g date-fns
    const dateAdapterMatch = fullName.match(/^@mui\/lab\/(Adapter.*)/);
    if (dateAdapterMatch !== null) {
      const packageName = dateAdapterPackageMapping[dateAdapterMatch[1]];
      if (packageName === undefined) {
        throw new TypeError(
          `Can't determine required npm package for adapter '${dateAdapterMatch[1]}'`
        );
      }
      deps[packageName] = "latest";
    }
  }

  deps = includePeerDependencies(deps, versions);

  if (codeLanguage === CODE_VARIANTS.TS) {
    addTypeDeps(deps);
    deps.typescript = "latest";
  }

  if (!deps["@mui/material"]) {
    // The `index.js` imports StyledEngineProvider from '@mui/material', so we need to make sure we have it as a dependency
    const name = "@mui/material";
    deps[name] = versions[name] ? versions[name] : "latest";
  }

  return deps;
}
