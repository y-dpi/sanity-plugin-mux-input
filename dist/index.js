"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
));
Object.defineProperty(exports, "__esModule", { value: !0 });
var sanity = require("sanity"), jsxRuntime = require("react/jsx-runtime"), icons = require("@sanity/icons"), ui = require("@sanity/ui"), React = require("react"), compact = require("lodash/compact.js"), toLower = require("lodash/toLower.js"), trim = require("lodash/trim.js"), uniq = require("lodash/uniq.js"), words = require("lodash/words.js"), suspendReact = require("suspend-react"), rxjs = require("rxjs"), styledComponents = require("styled-components"), uuid = require("@sanity/uuid"), operators = require("rxjs/operators"), LanguagesList = require("iso-639-1"), MuxPlayer = require("@mux/mux-player-react/lazy"), router = require("sanity/router"), isNumber = require("lodash/isNumber.js"), isString = require("lodash/isString.js"), reactRx = require("react-rx"), useSWR = require("swr"), scrollIntoView = require("scroll-into-view-if-needed"), upchunk = require("@mux/upchunk"), reactIs = require("react-is");
function _interopDefaultCompat(e) {
  return e && typeof e == "object" && "default" in e ? e : { default: e };
}
var React__default = /* @__PURE__ */ _interopDefaultCompat(React), compact__default = /* @__PURE__ */ _interopDefaultCompat(compact), toLower__default = /* @__PURE__ */ _interopDefaultCompat(toLower), trim__default = /* @__PURE__ */ _interopDefaultCompat(trim), uniq__default = /* @__PURE__ */ _interopDefaultCompat(uniq), words__default = /* @__PURE__ */ _interopDefaultCompat(words), LanguagesList__default = /* @__PURE__ */ _interopDefaultCompat(LanguagesList), MuxPlayer__default = /* @__PURE__ */ _interopDefaultCompat(MuxPlayer), isNumber__default = /* @__PURE__ */ _interopDefaultCompat(isNumber), isString__default = /* @__PURE__ */ _interopDefaultCompat(isString), useSWR__default = /* @__PURE__ */ _interopDefaultCompat(useSWR), scrollIntoView__default = /* @__PURE__ */ _interopDefaultCompat(scrollIntoView);
const ToolIcon = () => /* @__PURE__ */ jsxRuntime.jsx(
  "svg",
  {
    stroke: "currentColor",
    fill: "currentColor",
    strokeWidth: "0",
    viewBox: "0 0 24 24",
    height: "1em",
    width: "1em",
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12zm-5-6l-7 4V7z" })
  }
), LOCAL_STORAGE_HAS_SHOWN_WARNING_KEY = "mux-plugin-has-shown-drm-playback-warning", DrmPlaybackWarningContext = React.createContext({
  hasShownWarning: !1,
  setHasWarnedAboutDrmPlayback: () => null
}), DrmPlaybackWarningContextProvider = ({
  config,
  children
}) => {
  const hasWarned = (config?.disableDrmPlaybackWarning ?? !1) || window.localStorage.getItem(LOCAL_STORAGE_HAS_SHOWN_WARNING_KEY) === "true", [hasWarnedAboutDrmPlayback, setHasWarnedAboutDrmPlayback] = React.useState(hasWarned), setHasShownWarning = (b) => {
    window.localStorage.setItem(LOCAL_STORAGE_HAS_SHOWN_WARNING_KEY, b.toString()), setHasWarnedAboutDrmPlayback(b);
  };
  return /* @__PURE__ */ jsxRuntime.jsx(
    DrmPlaybackWarningContext.Provider,
    {
      value: {
        hasShownWarning: hasWarnedAboutDrmPlayback,
        setHasWarnedAboutDrmPlayback: setHasShownWarning
      },
      children
    }
  );
}, useDrmPlaybackWarningContext = () => React.useContext(DrmPlaybackWarningContext), DRMWarningDialog = ({ onClose }) => {
  const { setHasWarnedAboutDrmPlayback } = useDrmPlaybackWarningContext(), _onClose = () => {
    setHasWarnedAboutDrmPlayback(!0), onClose();
  };
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.Dialog,
    {
      open: !0,
      id: "drm-playback-warn",
      onClose: _onClose,
      header: "DRM Playback Warning",
      footer: /* @__PURE__ */ jsxRuntime.jsx(ui.Stack, { padding: 3, children: /* @__PURE__ */ jsxRuntime.jsx(ui.Button, { mode: "ghost", tone: "primary", onClick: _onClose, text: "Ok" }) }),
      children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 3, padding: 3, children: [
        /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { padding: [3, 3, 3], radius: 2, children: /* @__PURE__ */ jsxRuntime.jsx(ui.Stack, { space: 3, children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, weight: "semibold", children: "DRM-protected playback will generate a license with a small associated cost. The plugin will attempt to play signed or public playback IDs instead whenever possible." }) }) }),
        /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { padding: [3, 3, 3], radius: 2, tone: "suggest", children: /* @__PURE__ */ jsxRuntime.jsx(ui.Stack, { space: 3, children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, weight: "semibold", children: "This is a one time warning. If it persists, you can disable it from your plugin configuration." }) }) })
      ] })
    }
  );
}, SANITY_API_VERSION = "2024-03-05";
function useClient() {
  return sanity.useClient({ apiVersion: SANITY_API_VERSION });
}
const SPECIAL_CHARS = /([^!@#$%^&*(),\\/?";:{}|[\]+<>\s-])+/g, STRIP_EDGE_CHARS = /(^[.]+)|([.]+$)/;
function tokenize(string) {
  return (string.match(SPECIAL_CHARS) || []).map((token) => token.replace(STRIP_EDGE_CHARS, ""));
}
function toGroqParams(terms) {
  const params = {};
  return terms.reduce((acc, term, i) => (acc[`t${i}`] = `*${term}*`, acc), params);
}
function extractTermsFromQuery(query) {
  const quotedQueries = [], unquotedQuery = query.replace(/("[^"]*")/g, (match) => words__default.default(match).length > 1 ? (quotedQueries.push(match), "") : match), quotedTerms = quotedQueries.map((str) => trim__default.default(toLower__default.default(str))), remainingTerms = uniq__default.default(compact__default.default(tokenize(toLower__default.default(unquotedQuery))));
  return [...quotedTerms, ...remainingTerms];
}
function createConstraints(terms, includeAssetId) {
  const searchPaths = includeAssetId ? ["filename", "assetId"] : ["filename"];
  return terms.map((_term, i) => searchPaths.map((joinedPath) => `${joinedPath} match $t${i}`)).filter((constraint) => constraint.length > 0).map((constraint) => `(${constraint.join(" || ")})`);
}
function createSearchFilter(query) {
  const terms = extractTermsFromQuery(query);
  return {
    filter: createConstraints(terms, query.length >= 8),
    // if the search is big enough, include the assetId (mux id) in the results
    params: {
      ...toGroqParams(terms)
    }
  };
}
const ASSET_SORT_OPTIONS = {
  createdDesc: { groq: "_createdAt desc", label: "Newest first" },
  createdAsc: { groq: "_createdAt asc", label: "First created (oldest)" },
  filenameAsc: { groq: "filename asc", label: "By filename (A-Z)" },
  filenameDesc: { groq: "filename desc", label: "By filename (Z-A)" }
}, useAssetDocuments = sanity.createHookFromObservableFactory(({ documentStore, sort, searchQuery }) => {
  const search = createSearchFilter(searchQuery), filter = ['_type == "mux.videoAsset"', "defined(playbackId)", ...search.filter].filter(Boolean).join(" && "), sortFragment = ASSET_SORT_OPTIONS[sort].groq;
  return documentStore.listenQuery(
    /* groq */
    `*[${filter}] | order(${sortFragment})`,
    search.params,
    {
      apiVersion: SANITY_API_VERSION
    }
  );
});
function useAssets() {
  const documentStore = sanity.useDocumentStore(), [sort, setSort] = React.useState("createdDesc"), [searchQuery, setSearchQuery] = React.useState(""), [assetDocuments = [], isLoading] = useAssetDocuments(
    React.useMemo(() => ({ documentStore, sort, searchQuery }), [documentStore, sort, searchQuery])
  );
  return {
    assets: React.useMemo(
      () => (
        // Avoid displaying both drafts & published assets by collating them together and giving preference to drafts
        sanity.collate(assetDocuments).map(
          (collated) => ({
            ...collated.draft || collated.published || {},
            _id: collated.id
          })
        )
      ),
      [assetDocuments]
    ),
    isLoading,
    sort,
    searchQuery,
    setSort,
    setSearchQuery
  };
}
function useDialogState() {
  return React.useState(!1);
}
function saveSecrets(client, token, secretKey, enableSignedUrls, signingKeyId, signingKeyPrivate, drmConfigId) {
  const doc = {
    _id: "secrets.mux",
    _type: "mux.apiKey",
    token,
    secretKey,
    enableSignedUrls,
    signingKeyId,
    signingKeyPrivate,
    drmConfigId
  };
  return doc.signingKeyId = enableSignedUrls ? signingKeyId : "", doc.signingKeyPrivate = enableSignedUrls ? signingKeyPrivate : "", client.createOrReplace(doc);
}
async function createSigningKeys(client) {
  try {
    const { dataset } = client.config();
    return await client.request({
      url: `/addons/mux/signing-keys/${dataset}`,
      withCredentials: !0,
      method: "POST"
    });
  } catch (error) {
    console.error("Error creating signing keys", error);
    const message = error.response?.statusCode === 401 ? 'Unauthorized - Failed to create the Signing Key. Please ensure that the token has "System" permissions' : error.message;
    throw new Error(message);
  }
}
function testSecrets(client) {
  const { dataset } = client.config();
  return client.request({
    url: `/addons/mux/secrets/${dataset}/test`,
    withCredentials: !0,
    method: "GET"
  });
}
async function haveValidSigningKeys(client, signingKeyId, signingKeyPrivate) {
  if (!(signingKeyId && signingKeyPrivate))
    return !1;
  const { dataset } = client.config();
  try {
    const res = await client.request({
      url: `/addons/mux/signing-keys/${dataset}/${signingKeyId}`,
      withCredentials: !0,
      method: "GET"
    });
    return !!(res.data && res.data.id);
  } catch {
    return console.error("Error fetching signingKeyId", signingKeyId, "assuming it is not valid"), !1;
  }
}
function testSecretsObservable(client) {
  const { dataset } = client.config();
  return rxjs.defer(
    () => client.observable.request({
      url: `/addons/mux/secrets/${dataset}/test`,
      withCredentials: !0,
      method: "GET"
    })
  );
}
const useSaveSecrets = (client, secrets) => React.useCallback(
  async ({
    token,
    secretKey,
    enableSignedUrls,
    drmConfigId
  }) => {
    let { signingKeyId, signingKeyPrivate } = secrets;
    try {
      if (await saveSecrets(
        client,
        token,
        secretKey,
        enableSignedUrls,
        signingKeyId,
        signingKeyPrivate,
        drmConfigId
      ), !(await testSecrets(client))?.status && token && secretKey)
        throw new Error("Invalid secrets");
    } catch (err) {
      throw console.error("Error while trying to save secrets:", err), err;
    }
    if (enableSignedUrls && !await haveValidSigningKeys(
      client,
      signingKeyId,
      signingKeyPrivate
    ))
      try {
        const { data } = await createSigningKeys(client);
        signingKeyId = data.id, signingKeyPrivate = data.private_key, await saveSecrets(
          client,
          token,
          secretKey,
          enableSignedUrls,
          signingKeyId,
          signingKeyPrivate,
          drmConfigId ?? ""
        );
      } catch (err) {
        throw console.log("Error while creating and saving signing key:", err?.message), err;
      }
    return {
      token,
      secretKey,
      enableSignedUrls,
      signingKeyId,
      signingKeyPrivate,
      drmConfigId
    };
  },
  [client, secrets]
), name = "mux-input", cacheNs = "sanity-plugin-mux-input", muxSecretsDocumentId = "secrets.mux", DIALOGS_Z_INDEX = 6e4, THUMBNAIL_ASPECT_RATIO = 1.7777777777777777, MIN_ASPECT_RATIO = 5 / 4, AUDIO_ASPECT_RATIO = 5 / 1, path$1 = [
  "token",
  "secretKey",
  "enableSignedUrls",
  "signingKeyId",
  "signingKeyPrivate",
  "drmConfigId"
], useSecretsDocumentValues = () => {
  const { error, isLoading, value } = sanity.useDocumentValues(
    muxSecretsDocumentId,
    path$1
  ), cache = React.useMemo(() => {
    const exists = !!value, secrets = {
      token: value?.token || null,
      secretKey: value?.secretKey || null,
      enableSignedUrls: value?.enableSignedUrls || !1,
      signingKeyId: value?.signingKeyId || null,
      signingKeyPrivate: value?.signingKeyPrivate || null,
      drmConfigId: value?.drmConfigId || null
    };
    return {
      isInitialSetup: !exists,
      needsSetup: !secrets?.token || !secrets?.secretKey,
      secrets
    };
  }, [value]);
  return { error, isLoading, value: cache };
};
function init({ token, secretKey, enableSignedUrls, drmConfigId }) {
  return {
    submitting: !1,
    error: null,
    // Form inputs don't set the state back to null when clearing a field, but uses empty strings
    // This ensures the `dirty` check works correctly
    token: token ?? "",
    secretKey: secretKey ?? "",
    enableSignedUrls: enableSignedUrls ?? !1,
    drmConfigId: drmConfigId ?? ""
  };
}
function reducer(state, action) {
  switch (action?.type) {
    case "submit":
      return { ...state, submitting: !0, error: null };
    case "error":
      return { ...state, submitting: !1, error: action.payload };
    case "reset":
      return init(action.payload);
    case "change":
      return { ...state, [action.payload.name]: action.payload.value };
    default:
      throw new Error(`Unknown action type: ${action?.type}`);
  }
}
const useSecretsFormState = (secrets) => React.useReducer(reducer, secrets, init), _id = "secrets.mux";
function readSecrets(client) {
  const { projectId, dataset } = client.config();
  return suspendReact.suspend(async () => {
    const data = await client.fetch(
      /* groq */
      `*[_id == $_id][0]{
        token,
        secretKey,
        enableSignedUrls,
        signingKeyId,
        signingKeyPrivate,
        drmConfigId
      }`,
      { _id }
    );
    return {
      token: data?.token || null,
      secretKey: data?.secretKey || null,
      enableSignedUrls: !!data?.enableSignedUrls || !1,
      signingKeyId: data?.signingKeyId || null,
      signingKeyPrivate: data?.signingKeyPrivate || null,
      drmConfigId: data?.drmConfigId || null
    };
  }, [cacheNs, _id, projectId, dataset]);
}
function MuxLogo({ height = 26 }) {
  const id = React.useId(), fillColor = ui.useTheme_v2().color._dark ? "white" : "black", titleId = React.useMemo(() => `${id}-title`, [id]), pathStyle = {
    fillRule: "nonzero"
  };
  return /* @__PURE__ */ jsxRuntime.jsx(
    "svg",
    {
      "aria-labelledby": titleId,
      style: { height: `${height}px` },
      viewBox: "0 0 1600 500",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      xmlSpace: "preserve",
      children: /* @__PURE__ */ jsxRuntime.jsxs("g", { id: "Layer-1", fill: fillColor, children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "path",
          {
            d: "M994.287,93.486c-17.121,-0 -31,-13.879 -31,-31c0,-17.121 13.879,-31 31,-31c17.121,-0 31,13.879 31,31c0,17.121 -13.879,31 -31,31m0,-93.486c-34.509,-0 -62.484,27.976 -62.484,62.486l0,187.511c0,68.943 -56.09,125.033 -125.032,125.033c-68.942,-0 -125.03,-56.09 -125.03,-125.033l0,-187.511c0,-34.51 -27.976,-62.486 -62.485,-62.486c-34.509,-0 -62.484,27.976 -62.484,62.486l0,187.511c0,137.853 112.149,250.003 249.999,250.003c137.851,-0 250.001,-112.15 250.001,-250.003l0,-187.511c0,-34.51 -27.976,-62.486 -62.485,-62.486",
            style: pathStyle
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "path",
          {
            d: "M1537.51,468.511c-17.121,-0 -31,-13.879 -31,-31c0,-17.121 13.879,-31 31,-31c17.121,-0 31,13.879 31,31c0,17.121 -13.879,31 -31,31m-275.883,-218.509l-143.33,143.329c-24.402,24.402 -24.402,63.966 0,88.368c24.402,24.402 63.967,24.402 88.369,-0l143.33,-143.329l143.328,143.329c24.402,24.4 63.967,24.402 88.369,-0c24.403,-24.402 24.403,-63.966 0.001,-88.368l-143.33,-143.329l0.001,-0.004l143.329,-143.329c24.402,-24.402 24.402,-63.965 0,-88.367c-24.402,-24.402 -63.967,-24.402 -88.369,-0l-143.329,143.328l-143.329,-143.328c-24.402,-24.401 -63.967,-24.402 -88.369,-0c-24.402,24.402 -24.402,63.965 0,88.367l143.329,143.329l0,0.004Z",
            style: pathStyle
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          "path",
          {
            d: "M437.511,468.521c-17.121,-0 -31,-13.879 -31,-31c0,-17.121 13.879,-31 31,-31c17.121,-0 31,13.879 31,31c0,17.121 -13.879,31 -31,31m23.915,-463.762c-23.348,-9.672 -50.226,-4.327 -68.096,13.544l-143.331,143.329l-143.33,-143.329c-17.871,-17.871 -44.747,-23.216 -68.096,-13.544c-23.349,9.671 -38.574,32.455 -38.574,57.729l0,375.026c0,34.51 27.977,62.486 62.487,62.486c34.51,-0 62.486,-27.976 62.486,-62.486l0,-224.173l80.843,80.844c24.404,24.402 63.965,24.402 88.369,-0l80.843,-80.844l0,224.173c0,34.51 27.976,62.486 62.486,62.486c34.51,-0 62.486,-27.976 62.486,-62.486l0,-375.026c0,-25.274 -15.224,-48.058 -38.573,-57.729",
            style: pathStyle
          }
        )
      ] })
    }
  );
}
const Logo = styledComponents.styled.span`
  display: inline-block;
  height: 0.8em;
  margin-right: 1em;
  transform: translate(0.3em, -0.2em);
`, Header = () => /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
  /* @__PURE__ */ jsxRuntime.jsx(Logo, { children: /* @__PURE__ */ jsxRuntime.jsx(MuxLogo, { height: 13 }) }),
  "API Credentials"
] });
function FormField(props) {
  const { children, title, description, inputId } = props;
  return /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 1, children: [
    /* @__PURE__ */ jsxRuntime.jsx(ui.Flex, { align: "flex-end", children: /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { flex: 1, paddingY: 2, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
      /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { as: "label", htmlFor: inputId, weight: "semibold", size: 1, children: title || /* @__PURE__ */ jsxRuntime.jsx("em", { children: "Untitled" }) }),
      description && /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { muted: !0, size: 1, children: description })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { children })
  ] });
}
var FormField$1 = React.memo(FormField);
const fieldNames = ["token", "secretKey", "enableSignedUrls", "drmConfigId"];
function ConfigureApiDialog({ secrets, setDialogState }) {
  const client = useClient(), [state, dispatch] = useSecretsFormState(secrets), hasSecretsInitially = React.useMemo(() => secrets.token && secrets.secretKey, [secrets]), handleClose = React.useCallback(() => setDialogState(!1), [setDialogState]), dirty = React.useMemo(
    () => secrets.token !== state.token || secrets.secretKey !== state.secretKey || secrets.enableSignedUrls !== state.enableSignedUrls || secrets.drmConfigId !== state.drmConfigId,
    [secrets, state]
  ), id = `ConfigureApi${React.useId()}`, [tokenId, secretKeyId, enableSignedUrlsId, drmConfigIdId] = React.useMemo(
    () => fieldNames.map((field) => `${id}-${field}`),
    [id]
  ), firstField = React.useRef(null), handleSaveSecrets = useSaveSecrets(client, secrets), saving = React.useRef(!1), handleSubmit = React.useCallback(
    (event) => {
      if (event.preventDefault(), !saving.current && event.currentTarget.reportValidity()) {
        saving.current = !0, dispatch({ type: "submit" });
        const { token, secretKey, enableSignedUrls, drmConfigId } = state;
        handleSaveSecrets({ token, secretKey, enableSignedUrls, drmConfigId }).then((savedSecrets) => {
          const { projectId, dataset } = client.config();
          suspendReact.clear([cacheNs, _id, projectId, dataset]), suspendReact.preload(() => Promise.resolve(savedSecrets), [cacheNs, _id, projectId, dataset]), setDialogState(!1);
        }).catch((err) => dispatch({ type: "error", payload: err.message })).finally(() => {
          saving.current = !1;
        });
      }
    },
    [client, dispatch, handleSaveSecrets, setDialogState, state]
  ), handleChangeToken = React.useCallback(
    (event) => {
      dispatch({
        type: "change",
        payload: { name: "token", value: event.currentTarget.value }
      });
    },
    [dispatch]
  ), handleChangeSecretKey = React.useCallback(
    (event) => {
      dispatch({
        type: "change",
        payload: { name: "secretKey", value: event.currentTarget.value }
      });
    },
    [dispatch]
  ), handleChangeEnableSignedUrls = React.useCallback(
    (event) => {
      dispatch({
        type: "change",
        payload: { name: "enableSignedUrls", value: event.currentTarget.checked }
      });
    },
    [dispatch]
  ), handleChangeDrmConfigId = React.useCallback(
    (event) => {
      dispatch({
        type: "change",
        payload: { name: "drmConfigId", value: event.currentTarget.value }
      });
    },
    [dispatch]
  );
  return React.useEffect(() => {
    firstField.current && firstField.current.focus();
  }, [firstField]), /* @__PURE__ */ jsxRuntime.jsx(
    ui.Dialog,
    {
      animate: !0,
      id,
      onClose: handleClose,
      onClickOutside: handleClose,
      header: /* @__PURE__ */ jsxRuntime.jsx(Header, {}),
      zOffset: DIALOGS_Z_INDEX,
      position: "fixed",
      width: 1,
      children: /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { padding: 3, children: /* @__PURE__ */ jsxRuntime.jsx("form", { onSubmit: handleSubmit, noValidate: !0, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 4, children: [
        !hasSecretsInitially && /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { padding: [3, 3, 3], radius: 2, shadow: 1, tone: "primary", children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 3, children: [
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: 1, children: [
            "To set up a new access token, go to your",
            " ",
            /* @__PURE__ */ jsxRuntime.jsx(
              "a",
              {
                href: "https://dashboard.mux.com/settings/access-tokens",
                target: "_blank",
                rel: "noreferrer noopener",
                children: "account on mux.com"
              }
            ),
            "."
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: 1, children: [
            "The access token needs permissions: ",
            /* @__PURE__ */ jsxRuntime.jsx("strong", { children: "Mux Video " }),
            "(Full Access) and ",
            /* @__PURE__ */ jsxRuntime.jsx("strong", { children: "Mux Data" }),
            " (Read)",
            /* @__PURE__ */ jsxRuntime.jsx("br", {}),
            "To use Signed URLs, the token must also have System permissions.",
            /* @__PURE__ */ jsxRuntime.jsx("br", {}),
            "The credentials will be stored safely in a hidden document only available to editors."
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntime.jsx(FormField$1, { title: "Access Token", inputId: tokenId, children: /* @__PURE__ */ jsxRuntime.jsx(
          ui.TextInput,
          {
            id: tokenId,
            ref: firstField,
            onChange: handleChangeToken,
            type: "text",
            value: state.token ?? "",
            required: !!state.secretKey || state.enableSignedUrls
          }
        ) }),
        /* @__PURE__ */ jsxRuntime.jsx(FormField$1, { title: "Secret Key", inputId: secretKeyId, children: /* @__PURE__ */ jsxRuntime.jsx(
          ui.TextInput,
          {
            id: secretKeyId,
            onChange: handleChangeSecretKey,
            type: "text",
            value: state.secretKey ?? "",
            required: !!state.token || state.enableSignedUrls
          }
        ) }),
        /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 4, children: [
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.Checkbox,
              {
                id: enableSignedUrlsId,
                onChange: handleChangeEnableSignedUrls,
                checked: state.enableSignedUrls,
                style: { display: "block" }
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { flex: 1, paddingLeft: 3, children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { children: /* @__PURE__ */ jsxRuntime.jsx("label", { htmlFor: enableSignedUrlsId, children: "Enable Signed Urls" }) }) })
          ] }),
          secrets.signingKeyId && state.enableSignedUrls ? /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { padding: [3, 3, 3], radius: 2, shadow: 1, tone: "caution", children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 3, children: [
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, children: "The signing key ID that Sanity will use is:" }),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Code, { size: 1, children: secrets.signingKeyId }),
            /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: 1, children: [
              "This key is only used for previewing content in the Sanity UI.",
              /* @__PURE__ */ jsxRuntime.jsx("br", {}),
              "You should generate a different key to use in your application server."
            ] })
          ] }) }) : null
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(FormField$1, { title: "DRM Configuration ID", inputId: drmConfigIdId, children: /* @__PURE__ */ jsxRuntime.jsx(
          ui.TextInput,
          {
            id: drmConfigIdId,
            onChange: handleChangeDrmConfigId,
            type: "text",
            value: state.drmConfigId ?? "",
            required: !1
          }
        ) }),
        /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { padding: [3, 3, 3], radius: 2, shadow: 1, tone: "neutral", children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 3, children: [
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: 1, children: [
            "DRM (Digital Rights Management) provides an extra layer of content security for video content streamed from Mux. For additional information check out our",
            " ",
            /* @__PURE__ */ jsxRuntime.jsx(
              "a",
              {
                href: "https://www.mux.com/docs/guides/protect-videos-with-drm#play-drm-protected-videos",
                target: "_blank",
                rel: "noopener noreferrer",
                children: "DRM Guide"
              }
            ),
            "."
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: 1, children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              "a",
              {
                href: "https://www.mux.com/support/human",
                target: "_blank",
                rel: "noopener noreferrer",
                children: "Contact us"
              }
            ),
            " ",
            "to get started using DRM."
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntime.jsxs(ui.Inline, { space: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            ui.Button,
            {
              text: "Save",
              disabled: !dirty,
              loading: state.submitting,
              tone: "primary",
              mode: "default",
              type: "submit"
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            ui.Button,
            {
              disabled: state.submitting,
              text: "Cancel",
              mode: "bleed",
              onClick: handleClose
            }
          )
        ] }),
        state.error && /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { padding: [3, 3, 3], radius: 2, shadow: 1, tone: "critical", children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { children: state.error }) })
      ] }) }) })
    }
  );
}
function ConfigureApi() {
  const [dialogOpen, setDialogOpen] = useDialogState(), secretDocumentValues = useSecretsDocumentValues(), openDialog = React.useCallback(() => setDialogOpen("secrets"), [setDialogOpen]);
  return dialogOpen === "secrets" ? /* @__PURE__ */ jsxRuntime.jsx(
    ConfigureApiDialog,
    {
      secrets: secretDocumentValues.value.secrets,
      setDialogState: setDialogOpen
    }
  ) : /* @__PURE__ */ jsxRuntime.jsx(ui.Button, { mode: "bleed", text: "Configure plugin", onClick: openDialog });
}
function generateAssetPlaceholder(assetId) {
  return `Asset #${sanity.truncateString(assetId, 15)}`;
}
function isEmptyOrPlaceholderTitle(filename, assetId) {
  if (!filename || filename.trim() === "")
    return !0;
  const placeholder = generateAssetPlaceholder(assetId);
  return filename === placeholder;
}
function parseMuxDate(date) {
  return new Date(Number(date) * 1e3);
}
function deleteAssetOnMux(client, assetId) {
  const { dataset } = client.config();
  return client.request({
    url: `/addons/mux/assets/${dataset}/${assetId}`,
    withCredentials: !0,
    method: "DELETE"
  });
}
async function deleteAsset({
  client,
  asset,
  deleteOnMux
}) {
  if (!asset?._id) return !0;
  try {
    await client.delete(asset._id);
  } catch {
    return "failed-sanity";
  }
  if (deleteOnMux && asset?.assetId)
    try {
      await deleteAssetOnMux(client, asset.assetId);
    } catch {
      return "failed-mux";
    }
  return !0;
}
function getAsset(client, assetId) {
  const { dataset } = client.config();
  return client.request({
    url: `/addons/mux/assets/${dataset}/data/${assetId}`,
    withCredentials: !0,
    method: "GET"
  });
}
function listAssets(client, options) {
  const { dataset } = client.config(), query = {};
  return options.limit && (query.limit = options.limit.toString()), options.cursor && (query.cursor = options.cursor), client.request({
    url: `/addons/mux/assets/${dataset}/data/list`,
    withCredentials: !0,
    method: "GET",
    query
  });
}
function addTextTrackFromUrl(client, assetId, vttUrl, options) {
  const { dataset } = client.config();
  return client.request({
    url: `/addons/mux/assets/${dataset}/${assetId}/tracks`,
    withCredentials: !0,
    method: "POST",
    body: {
      url: vttUrl,
      type: "text",
      language_code: options.language_code,
      name: options.name,
      text_type: options.text_type || "subtitles"
    },
    headers: {
      "Content-Type": "application/json"
    }
  });
}
function generateSubtitles(client, assetId, audioTrackId, options) {
  const { dataset } = client.config();
  return client.request({
    url: `/addons/mux/assets/${dataset}/${assetId}/tracks/${audioTrackId}/generate-subtitles`,
    withCredentials: !0,
    method: "POST",
    body: {
      generated_subtitles: [
        {
          language_code: options.language_code,
          name: options.name
        }
      ]
    },
    headers: {
      "Content-Type": "application/json"
    }
  });
}
function deleteTextTrack(client, assetId, trackId) {
  const { dataset } = client.config();
  return client.request({
    url: `/addons/mux/assets/${dataset}/${assetId}/tracks/${trackId}`,
    withCredentials: !0,
    method: "DELETE"
  });
}
async function updateMasterAccess(client, assetId, masterAccess) {
  const fpCredentials = await client.fetch('*[_id == "secrets.fullphysio"][0]');
  return fetch(fpCredentials.fpMuxProxyUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": fpCredentials.fpMuxProxyApiKey
    },
    body: JSON.stringify({
      asset_id: assetId,
      master_access: masterAccess
    })
  });
}
const ASSETS_PER_PAGE = 100;
async function fetchMuxAssetsPage(client, cursor) {
  try {
    const response = await listAssets(client, {
      limit: ASSETS_PER_PAGE,
      cursor
    });
    return {
      cursor,
      data: response.data,
      next_cursor: response.next_cursor || null
    };
  } catch {
    return {
      cursor,
      error: { _tag: "FetchError" }
    };
  }
}
function accumulateIntermediateState(currentState, pageResult) {
  const currentData = "data" in currentState && currentState.data || [], newAssets = "data" in pageResult && pageResult.data || [], { validAssets, skippedInThisPage } = newAssets.reduce(
    (acc, asset) => {
      const hasPlaybackIds = asset.playback_ids && asset.playback_ids.length > 0, isDuplicate = currentData.some((a2) => a2.id === asset.id);
      return hasPlaybackIds || (acc.skippedInThisPage = !0), hasPlaybackIds && !isDuplicate && acc.validAssets.push(asset), acc;
    },
    { validAssets: [], skippedInThisPage: !1 }
  );
  return {
    ...currentState,
    data: [...currentData, ...validAssets],
    error: "error" in pageResult ? pageResult.error : (
      // Reset error if current page is successful
      void 0
    ),
    cursor: "next_cursor" in pageResult ? pageResult.next_cursor : pageResult.cursor,
    loading: !0,
    hasSkippedAssetsWithoutPlayback: currentState.hasSkippedAssetsWithoutPlayback || skippedInThisPage
  };
}
function hasMorePages(pageResult) {
  return typeof pageResult == "object" && "next_cursor" in pageResult && pageResult.next_cursor !== null;
}
function useMuxAssets({ client, enabled }) {
  const [state, setState] = React.useState({ loading: !0, cursor: null });
  return React.useEffect(() => {
    if (!enabled) return;
    const subscription = rxjs.defer(
      () => fetchMuxAssetsPage(
        client,
        // When we've already successfully loaded before (fully or partially), we start from the next cursor to avoid re-fetching
        "data" in state && state.data && state.data.length > 0 && !state.error ? state.cursor : null
      )
    ).pipe(
      // Here we use "expand" to recursively fetch next pages
      operators.expand((pageResult) => hasMorePages(pageResult) ? rxjs.timer(2e3).pipe(
        operators.concatMap(
          () => (
            // eslint-disable-next-line max-nested-callbacks
            rxjs.defer(
              () => fetchMuxAssetsPage(
                client,
                "next_cursor" in pageResult ? pageResult.next_cursor : null
              )
            )
          )
        )
      ) : rxjs.of()),
      // On each iteration, persist intermediate states to give feedback to users
      operators.tap(
        (pageResult) => setState((prevState) => accumulateIntermediateState(prevState, pageResult))
      )
    ).subscribe({
      // Once done, let the user know we've stopped loading
      complete: () => {
        setState((prev) => ({
          ...prev,
          loading: !1
        }));
      }
    });
    return () => subscription.unsubscribe();
  }, [enabled]), state;
}
function useImportMuxAssets() {
  const documentStore = sanity.useDocumentStore(), client = sanity.useClient({
    apiVersion: SANITY_API_VERSION
  }), [assetsInSanity, assetsInSanityLoading] = useAssetsInSanity(documentStore), hasSecrets = !!useSecretsDocumentValues().value.secrets?.secretKey, [importError, setImportError] = React.useState(), [importState, setImportState] = React.useState("closed"), dialogOpen = importState !== "closed", muxAssets = useMuxAssets({
    client,
    enabled: hasSecrets && dialogOpen
  }), missingAssets = React.useMemo(() => assetsInSanity && muxAssets.data ? muxAssets.data.filter((a2) => !assetExistsInSanity(a2, assetsInSanity)) : void 0, [assetsInSanity, muxAssets.data]), [selectedAssets, setSelectedAssets] = React.useState([]), closeDialog = () => {
    importState !== "importing" && setImportState("closed");
  }, openDialog = () => {
    importState === "closed" && setImportState("idle");
  };
  async function importAssets() {
    setImportState("importing");
    const documents = selectedAssets.flatMap((asset) => muxAssetToSanityDocument(asset) || []), tx = client.transaction();
    documents.forEach((doc) => tx.create(doc));
    try {
      await tx.commit({ returnDocuments: !1 }), setSelectedAssets([]), setImportState("done");
    } catch (error) {
      setImportState("error"), setImportError(error);
    }
  }
  return {
    assetsInSanityLoading,
    closeDialog,
    dialogOpen,
    importState,
    importError,
    hasSecrets,
    importAssets,
    missingAssets,
    muxAssets,
    openDialog,
    selectedAssets,
    setSelectedAssets
  };
}
function muxAssetToSanityDocument(asset) {
  const playbackId = (asset.playback_ids || []).find((p) => p.id)?.id;
  if (playbackId)
    return {
      _id: uuid.uuid(),
      _type: "mux.videoAsset",
      _updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      _createdAt: parseMuxDate(asset.created_at).toISOString(),
      assetId: asset.id,
      playbackId,
      filename: asset.meta?.title ?? generateAssetPlaceholder(asset.id),
      status: asset.status,
      data: asset
    };
}
const useAssetsInSanity = sanity.createHookFromObservableFactory(
  (documentStore) => documentStore.listenQuery(
    /* groq */
    `*[_type == "mux.videoAsset"] {
      "uploadId": coalesce(uploadId, data.upload_id),
      "assetId": coalesce(assetId, data.id),
    }`,
    {},
    {
      apiVersion: SANITY_API_VERSION
    }
  )
);
function assetExistsInSanity(asset, existingAssets) {
  return asset.status !== "ready" ? !1 : existingAssets.some(
    (existing) => existing.assetId === asset.id || existing.uploadId === asset.upload_id
  );
}
function useInView(ref, options = {}) {
  const [inView, setInView] = React.useState(!1);
  return React.useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry], obs) => {
      const nowInView = entry.isIntersecting && obs.thresholds.some((threshold) => entry.intersectionRatio >= threshold);
      setInView(nowInView), options?.onChange?.(nowInView);
    }, options), toObserve = ref.current;
    return observer.observe(toObserve), () => {
      toObserve && observer.unobserve(toObserve);
    };
  }, [options, ref]), inView;
}
function getPlaybackId(asset, priority = ["drm", "signed", "public"]) {
  try {
    if (!asset)
      throw new TypeError("Tried to get playback Id with no asset");
    const playbackIds = asset.data?.playback_ids;
    if (playbackIds && playbackIds.length > 0) {
      for (const policy of priority) {
        const match = playbackIds.find((entry) => entry.policy === policy);
        if (match)
          return match.id;
      }
      return playbackIds[0].id;
    }
    throw new TypeError("Missing playbackId");
  } catch (e) {
    throw console.error("Asset is missing a playbackId", { asset }, e), e;
  }
}
function getPlaybackPolicy(asset) {
  return asset.data?.playback_ids?.find(
    (playbackId) => getPlaybackId(asset, ["drm", "signed", "public"]) === playbackId.id
  ) ?? { id: "", policy: "public" };
}
function getPlaybackPolicyById(asset, playbackId) {
  return asset.data?.playback_ids?.find((entry) => playbackId === entry.id);
}
function hasPlaybackPolicy(data, policy) {
  return data.advanced_playback_policies && data.advanced_playback_policies.find((p) => p.policy === policy) || data.playback_policy?.find((p) => p === policy);
}
function generateJwt(client, playbackId, aud, payload) {
  const { signingKeyId, signingKeyPrivate } = readSecrets(client);
  if (!signingKeyId)
    throw new TypeError("Missing `signingKeyId`.\n Check your plugin's configuration");
  if (!signingKeyPrivate)
    throw new TypeError("Missing `signingKeyPrivate`.\n Check your plugin's configuration");
  const { default: sign } = suspendReact.suspend(() => import("jsonwebtoken-esm/sign"), ["jsonwebtoken-esm/sign"]);
  return sign(
    payload ? JSON.parse(JSON.stringify(payload, (_, v) => v ?? void 0)) : {},
    atob(signingKeyPrivate),
    {
      algorithm: "RS256",
      keyid: signingKeyId,
      audience: aud,
      subject: playbackId,
      noTimestamp: !0,
      expiresIn: "12h"
    }
  );
}
function createUrlParamsObject(client, asset, params, audience) {
  const playbackId = getPlaybackId(asset);
  let searchParams = new URLSearchParams(
    JSON.parse(JSON.stringify(params, (_, v) => v ?? void 0))
  );
  const playbackPolicy = getPlaybackPolicyById(asset, playbackId)?.policy;
  if (playbackPolicy === "signed" || playbackPolicy === "drm") {
    const token = generateJwt(client, playbackId, audience, params);
    searchParams = new URLSearchParams({ token });
  }
  return { playbackId, searchParams };
}
function getAnimatedPosterSrc({
  asset,
  client,
  height,
  width,
  start = asset.thumbTime ? Math.max(0, asset.thumbTime - 2.5) : 0,
  end = start + 5,
  fps = 15
}) {
  const params = { height, width, start, end, fps }, { playbackId, searchParams } = createUrlParamsObject(client, asset, params, "g");
  return `https://image.mux.com/${playbackId}/animated.gif?${searchParams}`;
}
function getPosterSrc({
  asset,
  client,
  fit_mode,
  height,
  time = asset.thumbTime ?? void 0,
  width
}) {
  const params = { fit_mode, height, width };
  time !== void 0 && (params.time = time);
  const { playbackId, searchParams } = createUrlParamsObject(client, asset, params, "t");
  return `https://image.mux.com/${playbackId}/thumbnail.png?${searchParams}`;
}
function tryWithSuspend(block, onError) {
  try {
    return block();
  } catch (errorOrPromise) {
    if (errorOrPromise instanceof Promise)
      throw errorOrPromise;
    return onError ? onError(errorOrPromise) : void 0;
  }
}
const Image = styledComponents.styled.img`
  transition: opacity 0.175s ease-out 0s;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center center;
`, STATUS_TO_TONE = {
  loading: "transparent",
  error: "critical",
  loaded: "default"
};
function VideoThumbnail({
  asset,
  width,
  staticImage = !1
}) {
  const posterWidth = width || 250, client = useClient(), ref = React.useRef(null), inView = useInView(ref), [status, setStatus] = React.useState("loading"), [error, setError] = React.useState(null), thumbnailSrc = React.useMemo(() => tryWithSuspend(
    () => {
      let thumbnail;
      return staticImage ? thumbnail = getPosterSrc({ asset, client, width: posterWidth }) : thumbnail = getAnimatedPosterSrc({ asset, client, width: posterWidth }), thumbnail;
    },
    (err) => {
      handleError(err.message);
    }
  ), [asset, client, posterWidth, staticImage]);
  function handleLoad() {
    setStatus("loaded");
  }
  function handleError(err) {
    setStatus("error"), setError(err || "Failed loading thumbnail");
  }
  return /* @__PURE__ */ jsxRuntime.jsx(React.Suspense, { fallback: /* @__PURE__ */ jsxRuntime.jsx("span", { children: "Preparing thumbnail" }), children: /* @__PURE__ */ jsxRuntime.jsx(
    ui.Card,
    {
      style: {
        aspectRatio: THUMBNAIL_ASPECT_RATIO,
        position: "relative",
        maxWidth: width ? `${width}px` : void 0,
        width: "100%",
        flex: 1
      },
      border: !0,
      radius: 2,
      ref,
      tone: STATUS_TO_TONE[status],
      children: inView ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        status === "loading" && /* @__PURE__ */ jsxRuntime.jsx(
          ui.Box,
          {
            style: {
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)"
            },
            children: /* @__PURE__ */ jsxRuntime.jsx(ui.Spinner, {})
          }
        ),
        status === "error" && /* @__PURE__ */ jsxRuntime.jsxs(
          ui.Stack,
          {
            space: 4,
            style: {
              position: "absolute",
              width: "100%",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              justifyItems: "center"
            },
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 4, muted: !0, children: /* @__PURE__ */ jsxRuntime.jsx(icons.ErrorOutlineIcon, { style: { fontSize: "1.75em" } }) }),
              /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { muted: !0, align: "center", children: error })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          Image,
          {
            src: thumbnailSrc ?? void 0,
            alt: `Preview for ${staticImage ? "image" : "video"} ${asset.filename || asset.assetId}`,
            onLoad: handleLoad,
            onError: () => handleError(),
            style: { opacity: status === "loaded" ? 1 : 0 }
          }
        )
      ] }) : null
    }
  ) });
}
const MissingAssetCheckbox = styledComponents.styled(ui.Checkbox)`
  position: static !important;

  input::after {
    content: '';
    position: absolute;
    inset: 0;
    display: block;
    cursor: pointer;
    z-index: 1000;
  }
`;
function MissingAsset({
  asset,
  selectAsset,
  selected
}) {
  const duration = sanity.useFormattedDuration(asset.duration * 1e3);
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.Card,
    {
      tone: selected ? "positive" : void 0,
      border: !0,
      paddingX: 2,
      paddingY: 3,
      style: { position: "relative" },
      radius: 1,
      children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", gap: 2, children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          MissingAssetCheckbox,
          {
            checked: selected,
            onChange: (e) => {
              selectAsset(e.currentTarget.checked);
            },
            "aria-label": selected ? `Import video ${asset.id}` : `Skip import of video ${asset.id}`
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          VideoThumbnail,
          {
            asset: {
              assetId: asset.id,
              data: asset,
              filename: asset.id,
              playbackId: asset.playback_ids.find((p) => p.id)?.id
            },
            width: 150
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", gap: 1, children: [
            /* @__PURE__ */ jsxRuntime.jsx(ui.Code, { size: 2, children: sanity.truncateString(asset.id, 15) }),
            " ",
            /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { muted: !0, size: 2, children: [
              "(",
              duration.formatted,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: 1, children: [
            "Uploaded at",
            " ",
            new Date(Number(asset.created_at) * 1e3).toLocaleDateString("en", {
              year: "numeric",
              day: "2-digit",
              month: "2-digit"
            })
          ] })
        ] })
      ] })
    },
    asset.id
  );
}
function ImportVideosDialog(props) {
  const { importState } = props, canTriggerImport = (importState === "idle" || importState === "error") && props.selectedAssets.length > 0, isImporting = importState === "importing", noAssetsToImport = props.missingAssets?.length === 0 && !props.muxAssets.loading && !props.assetsInSanityLoading;
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.Dialog,
    {
      animate: !0,
      header: "Import videos from Mux",
      zOffset: DIALOGS_Z_INDEX,
      id: "video-details-dialog",
      onClose: props.closeDialog,
      onClickOutside: props.closeDialog,
      width: 1,
      position: "fixed",
      footer: importState !== "done" && !noAssetsToImport && /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { padding: 3, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { justify: "space-between", align: "center", children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Button,
          {
            fontSize: 2,
            padding: 3,
            mode: "ghost",
            text: "Cancel",
            tone: "critical",
            onClick: props.closeDialog,
            disabled: isImporting
          }
        ),
        props.missingAssets && /* @__PURE__ */ jsxRuntime.jsx(
          ui.Button,
          {
            icon: icons.RetrieveIcon,
            fontSize: 2,
            padding: 3,
            mode: "ghost",
            text: props.selectedAssets?.length > 0 ? `Import ${props.selectedAssets.length} video(s)` : "No video(s) selected",
            tone: "positive",
            onClick: props.importAssets,
            iconRight: isImporting && ui.Spinner,
            disabled: !canTriggerImport
          }
        )
      ] }) }),
      children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Box, { padding: 3, children: [
        props.muxAssets.hasSkippedAssetsWithoutPlayback && /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { tone: "caution", marginBottom: 5, padding: 3, border: !0, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", gap: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsx(icons.InfoOutlineIcon, { fontSize: 36 }),
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 2, weight: "semibold", children: "Some videos were skipped" }),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, children: "Videos without playback IDs cannot be imported and have been excluded from the list." })
          ] })
        ] }) }),
        (props.muxAssets.loading || props.assetsInSanityLoading) && /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { tone: "primary", marginBottom: 5, padding: 3, border: !0, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", gap: 4, children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.Spinner, { muted: !0, size: 4 }),
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 2, weight: "semibold", children: "Loading assets from Mux" }),
            /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: 1, children: [
              "This may take a while.",
              props.missingAssets && props.missingAssets.length > 0 && ` There are at least ${props.missingAssets.length} video${props.missingAssets.length > 1 ? "s" : ""} currently not in Sanity...`
            ] })
          ] })
        ] }) }),
        props.muxAssets.error && /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { tone: "critical", marginBottom: 5, padding: 3, border: !0, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", gap: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsx(icons.ErrorOutlineIcon, { fontSize: 36 }),
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 2, weight: "semibold", children: "There was an error getting all data from Mux" }),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, children: props.missingAssets ? `But we've found ${props.missingAssets.length} video${props.missingAssets.length > 1 ? "s" : ""} not in Sanity, which you can start importing now.` : "Please try again or contact a developer for help." })
          ] })
        ] }) }),
        importState === "importing" && /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { tone: "primary", marginBottom: 5, padding: 3, border: !0, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", gap: 4, children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.Spinner, { muted: !0, size: 4 }),
          /* @__PURE__ */ jsxRuntime.jsx(ui.Stack, { space: 2, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: 2, weight: "semibold", children: [
            "Importing ",
            props.selectedAssets.length,
            " video",
            props.selectedAssets.length > 1 && "s",
            " from Mux"
          ] }) })
        ] }) }),
        importState === "error" && /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { tone: "critical", marginBottom: 5, padding: 3, border: !0, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", gap: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsx(icons.ErrorOutlineIcon, { fontSize: 36 }),
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 2, weight: "semibold", children: "There was an error importing videos" }),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, children: props.importError ? `Error: ${props.importError}` : "Please try again or contact a developer for help." }),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { marginTop: 1, children: /* @__PURE__ */ jsxRuntime.jsx(
              ui.Button,
              {
                icon: icons.RetryIcon,
                text: "Retry",
                tone: "primary",
                onClick: props.importAssets
              }
            ) })
          ] })
        ] }) }),
        (noAssetsToImport || importState === "done") && /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { paddingY: 5, marginBottom: 4, space: 3, style: { textAlign: "center" }, children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { children: /* @__PURE__ */ jsxRuntime.jsx(icons.CheckmarkCircleIcon, { fontSize: 48 }) }),
          /* @__PURE__ */ jsxRuntime.jsx(ui.Heading, { size: 2, children: importState === "done" ? "Videos imported successfully" : "There are no Mux videos to import" }),
          /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 2, children: importState === "done" ? "You can now use them in your Sanity content." : "They're all in Sanity and ready to be used in your content." })
        ] }),
        props.missingAssets && props.missingAssets.length > 0 && (importState === "idle" || importState === "error") && /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 4, children: [
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Heading, { size: 1, children: [
            "There are ",
            props.missingAssets.length,
            props.muxAssets.loading && "+",
            " Mux video",
            props.missingAssets.length > 1 && "s",
            " ",
            "not in Sanity"
          ] }),
          !props.muxAssets.loading && /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", paddingX: 2, children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.Checkbox,
              {
                id: "import-all",
                style: { display: "block" },
                onClick: (e) => {
                  e.currentTarget.checked ? props.missingAssets && props.setSelectedAssets(props.missingAssets) : props.setSelectedAssets([]);
                },
                checked: props.selectedAssets.length === props.missingAssets.length
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { flex: 1, paddingLeft: 3, as: "label", htmlFor: "import-all", children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { children: "Import all" }) })
          ] }),
          props.missingAssets.map((asset) => /* @__PURE__ */ jsxRuntime.jsx(
            MissingAsset,
            {
              asset,
              selectAsset: (selected) => {
                selected ? props.setSelectedAssets([...props.selectedAssets, asset]) : props.setSelectedAssets(props.selectedAssets.filter((a2) => a2.id !== asset.id));
              },
              selected: props.selectedAssets.some((a2) => a2.id === asset.id)
            },
            asset.id
          ))
        ] })
      ] })
    }
  );
}
function ImportVideosFromMux() {
  const importAssets = useImportMuxAssets();
  if (importAssets.hasSecrets)
    return importAssets.dialogOpen ? /* @__PURE__ */ jsxRuntime.jsx(ImportVideosDialog, { ...importAssets }) : /* @__PURE__ */ jsxRuntime.jsx(ui.Button, { mode: "bleed", text: "Import from Mux", onClick: importAssets.openDialog });
}
const PageSelector = (props) => {
  const page = props.page, setPage = props.setPage;
  return React.useEffect(() => {
    const clamped = Math.min(props.total - 1, Math.max(0, page));
    page !== clamped && setPage(clamped);
  }, [page, props.total, setPage]), /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      ui.Button,
      {
        icon: icons.ChevronLeftIcon,
        mode: "bleed",
        padding: 3,
        style: { cursor: "pointer" },
        disabled: page <= 0,
        onClick: () => {
          setPage((p) => Math.min(props.total - 1, Math.max(0, p - 1)));
        }
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsxs(ui.Label, { muted: !0, children: [
      "Page ",
      page + 1,
      "/",
      props.total
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(
      ui.Button,
      {
        icon: icons.ChevronRightIcon,
        mode: "bleed",
        padding: 3,
        style: { cursor: "pointer" },
        disabled: page >= props.total - 1,
        onClick: () => {
          setPage((p) => Math.min(props.total - 1, Math.max(0, p + 1)));
        }
      }
    )
  ] });
};
function addKeysToMuxData(data) {
  return {
    ...data,
    tracks: data.tracks?.map((track) => ({
      ...track,
      _key: uuid.uuid()
    })),
    playback_ids: data.playback_ids?.map((playbackId) => ({
      ...playbackId,
      _key: uuid.uuid()
    })),
    static_renditions: data.static_renditions ? {
      ...data.static_renditions,
      files: data.static_renditions.files?.map((file) => ({
        ...file,
        _key: uuid.uuid()
      }))
    } : void 0
  };
}
function useResyncMuxMetadata() {
  const documentStore = sanity.useDocumentStore(), client = sanity.useClient({
    apiVersion: SANITY_API_VERSION
  }), [sanityAssets, sanityAssetsLoading] = useSanityAssets(documentStore), hasSecrets = !!useSecretsDocumentValues().value.secrets?.secretKey, [resyncError, setResyncError] = React.useState(), [resyncState, setResyncState] = React.useState("closed"), dialogOpen = resyncState !== "closed", muxAssets = useMuxAssets({
    client,
    enabled: hasSecrets && dialogOpen
  }), matchedAssets = React.useMemo(() => sanityAssets && muxAssets.data ? sanityAssets.map((sanityDoc) => {
    const muxAsset = muxAssets.data?.find(
      (m) => m.id === sanityDoc.assetId || m.id === sanityDoc.data?.id
    );
    return {
      sanityDoc,
      muxAsset,
      muxTitle: muxAsset?.meta?.title,
      currentTitle: sanityDoc.filename
    };
  }) : void 0, [sanityAssets, muxAssets.data]), closeDialog = () => {
    resyncState !== "syncing" && setResyncState("closed");
  }, openDialog = () => {
    resyncState === "closed" && setResyncState("idle");
  };
  async function syncAllVideos() {
    if (matchedAssets) {
      setResyncState("syncing");
      try {
        const tx = client.transaction();
        matchedAssets.forEach((matched) => {
          const newTitle = matched.muxTitle || "";
          tx.patch(matched.sanityDoc._id, { set: { filename: newTitle } });
        }), await tx.commit({ returnDocuments: !1 }), setResyncState("done");
      } catch (error) {
        setResyncState("error"), setResyncError(error);
      }
    }
  }
  async function syncOnlyEmpty() {
    if (matchedAssets) {
      setResyncState("syncing");
      try {
        const tx = client.transaction();
        matchedAssets.forEach((matched) => {
          matched.muxAsset && matched.muxTitle && isEmptyOrPlaceholderTitle(matched.currentTitle, matched.muxAsset.id) && tx.patch(matched.sanityDoc._id, { set: { filename: matched.muxTitle } });
        }), await tx.commit({ returnDocuments: !1 }), setResyncState("done");
      } catch (error) {
        setResyncState("error"), setResyncError(error);
      }
    }
  }
  async function syncFullData() {
    if (matchedAssets) {
      setResyncState("syncing");
      try {
        const tx = client.transaction();
        matchedAssets.forEach((matched) => {
          if (!matched.muxAsset) return;
          const dataWithKeys = addKeysToMuxData(matched.muxAsset);
          tx.patch(matched.sanityDoc._id, {
            set: {
              filename: matched.muxTitle || matched.currentTitle || "",
              status: matched.muxAsset.status,
              data: dataWithKeys
            }
          });
        }), await tx.commit({ returnDocuments: !1 }), setResyncState("done");
      } catch (error) {
        setResyncState("error"), setResyncError(error);
      }
    }
  }
  return {
    sanityAssetsLoading,
    closeDialog,
    dialogOpen,
    resyncState,
    resyncError,
    hasSecrets,
    syncAllVideos,
    syncOnlyEmpty,
    syncFullData,
    matchedAssets,
    muxAssets,
    openDialog
  };
}
const useSanityAssets = sanity.createHookFromObservableFactory(
  (documentStore) => documentStore.listenQuery(
    /* groq */
    '*[_type == "mux.videoAsset"]',
    {},
    {
      apiVersion: SANITY_API_VERSION
    }
  )
);
function OptionCard({
  id,
  selected,
  onSelect,
  title,
  count,
  description,
  disabled
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.Card,
    {
      as: "label",
      padding: 3,
      radius: 2,
      border: !0,
      tone: selected ? "primary" : "default",
      style: {
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1
      },
      children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { gap: 3, align: "flex-start", children: [
        /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { paddingTop: 1, children: /* @__PURE__ */ jsxRuntime.jsx(
          ui.Radio,
          {
            checked: selected,
            onChange: () => onSelect(id),
            disabled,
            name: "sync-option"
          }
        ) }),
        /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, flex: 1, children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.Flex, { align: "center", gap: 2, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: 2, weight: "semibold", children: [
            title,
            " (",
            count,
            ")"
          ] }) }),
          /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, muted: !0, children: description })
        ] })
      ] })
    }
  );
}
function ResyncMetadataDialog(props) {
  const { resyncState } = props, videosToUpdate = props.matchedAssets?.filter((m) => m.muxAsset).length || 0, videosWithEmptyOrPlaceholder = props.matchedAssets?.filter(
    (m) => m.muxAsset && m.muxTitle && isEmptyOrPlaceholderTitle(m.currentTitle, m.muxAsset.id)
  ).length || 0, hasEmptyTitles = videosWithEmptyOrPlaceholder > 0, defaultOption = hasEmptyTitles ? "fillEmpty" : "syncTitles", [selectedOption, setSelectedOption] = React.useState(defaultOption), canTriggerResync = resyncState === "idle" || resyncState === "error", isResyncing = resyncState === "syncing", isDone = resyncState === "done", isLoading = props.muxAssets.loading || props.sanityAssetsLoading, handleSync = () => {
    switch (selectedOption) {
      case "fillEmpty":
        props.syncOnlyEmpty();
        break;
      case "syncTitles":
        props.syncAllVideos();
        break;
      case "fullResync":
        props.syncFullData();
        break;
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.Dialog,
    {
      animate: !0,
      header: "Sync with Mux",
      zOffset: DIALOGS_Z_INDEX,
      id: "resync-metadata-dialog",
      onClose: props.closeDialog,
      onClickOutside: props.closeDialog,
      width: 1,
      position: "fixed",
      footer: !isDone && /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { padding: 3, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { justify: "flex-end", gap: 2, children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Button,
          {
            fontSize: 2,
            padding: 3,
            mode: "ghost",
            text: "Cancel",
            onClick: props.closeDialog,
            disabled: isResyncing
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Button,
          {
            icon: icons.SyncIcon,
            fontSize: 2,
            padding: 3,
            text: "Run sync",
            tone: "primary",
            onClick: handleSync,
            iconRight: isResyncing && ui.Spinner,
            disabled: !canTriggerResync || isLoading
          }
        )
      ] }) }),
      children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Box, { padding: 4, children: [
        isLoading && /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { tone: "primary", marginBottom: 4, padding: 3, border: !0, radius: 2, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", gap: 4, children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.Spinner, { muted: !0, size: 4 }),
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 2, weight: "semibold", children: "Loading assets from Mux" }),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, muted: !0, children: "This may take a while." })
          ] })
        ] }) }),
        props.muxAssets.error && /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { tone: "critical", marginBottom: 4, padding: 3, border: !0, radius: 2, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", gap: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsx(icons.ErrorOutlineIcon, { fontSize: 36 }),
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 2, weight: "semibold", children: "There was an error getting data from Mux" }),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, children: "Please try again or contact a developer for help." })
          ] })
        ] }) }),
        resyncState === "syncing" && /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { tone: "primary", marginBottom: 4, padding: 3, border: !0, radius: 2, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", gap: 4, children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.Spinner, { muted: !0, size: 4 }),
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 2, weight: "semibold", children: "Syncing metadata" }),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, muted: !0, children: "Updating videos from Mux..." })
          ] })
        ] }) }),
        resyncState === "error" && /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { tone: "critical", marginBottom: 4, padding: 3, border: !0, radius: 2, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", gap: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsx(icons.ErrorOutlineIcon, { fontSize: 36 }),
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 2, weight: "semibold", children: "There was an error syncing metadata" }),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, children: props.resyncError ? `Error: ${props.resyncError}` : "Please try again or contact a developer for help." })
          ] })
        ] }) }),
        resyncState === "done" && /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { paddingY: 5, space: 3, style: { textAlign: "center" }, children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { children: /* @__PURE__ */ jsxRuntime.jsx(icons.CheckmarkCircleIcon, { fontSize: 48 }) }),
          /* @__PURE__ */ jsxRuntime.jsx(ui.Heading, { size: 2, children: "Sync completed" }),
          /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 2, muted: !0, children: "Videos have been updated from Mux." })
        ] }),
        !isDone && !isLoading && !props.muxAssets.error && /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 4, children: [
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: 1, muted: !0, children: [
            "Found ",
            videosToUpdate,
            " video",
            videosToUpdate === 1 ? "" : "s",
            " linked to Mux."
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 3, children: [
            hasEmptyTitles && /* @__PURE__ */ jsxRuntime.jsx(
              OptionCard,
              {
                id: "fillEmpty",
                selected: selectedOption === "fillEmpty",
                onSelect: setSelectedOption,
                title: "Fill missing titles only",
                count: videosWithEmptyOrPlaceholder,
                description: "Updates only videos without a title or with placeholder titles (e.g., 'Asset #123') using the title from Mux.",
                disabled: isResyncing
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              OptionCard,
              {
                id: "syncTitles",
                selected: selectedOption === "syncTitles",
                onSelect: setSelectedOption,
                title: "Sync all titles",
                count: videosToUpdate,
                description: "Replaces the title in Sanity with the title from Mux for all videos.",
                disabled: isResyncing
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              OptionCard,
              {
                id: "fullResync",
                selected: selectedOption === "fullResync",
                onSelect: setSelectedOption,
                title: "Full resync",
                count: videosToUpdate,
                description: "Updates all fields from Mux including status, duration, tracks, captions, and renditions.",
                disabled: isResyncing
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
function ResyncMetadata() {
  const resyncMetadata = useResyncMuxMetadata();
  if (resyncMetadata.hasSecrets)
    return resyncMetadata.dialogOpen ? /* @__PURE__ */ jsxRuntime.jsx(ResyncMetadataDialog, { ...resyncMetadata }) : /* @__PURE__ */ jsxRuntime.jsx(ui.Button, { mode: "bleed", text: "Sync with Mux", onClick: resyncMetadata.openDialog });
}
const CONTEXT_MENU_POPOVER_PROPS = {
  constrainSize: !0,
  placement: "bottom",
  portal: !0,
  width: 0
};
function SelectSortOptions(props) {
  const id = React.useId();
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.MenuButton,
    {
      button: /* @__PURE__ */ jsxRuntime.jsx(ui.Button, { text: "Sort", icon: icons.SortIcon, mode: "bleed", padding: 3, style: { cursor: "pointer" } }),
      id,
      menu: /* @__PURE__ */ jsxRuntime.jsx(ui.Menu, { children: Object.entries(ASSET_SORT_OPTIONS).map(([type, { label }]) => /* @__PURE__ */ jsxRuntime.jsx(
        ui.MenuItem,
        {
          "data-as": "button",
          onClick: () => props.setSort(type),
          padding: 3,
          tone: "default",
          text: label,
          pressed: type === props.sort
        },
        type
      )) }),
      popover: CONTEXT_MENU_POPOVER_PROPS
    }
  );
}
const SpinnerBox = () => /* @__PURE__ */ jsxRuntime.jsx(
  ui.Box,
  {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "150px"
    },
    children: /* @__PURE__ */ jsxRuntime.jsx(ui.Spinner, {})
  }
);
async function enableMasterAccess(client, assetId) {
  try {
    return (await testSecrets(client))?.status ? (await updateMasterAccess(client, assetId, "temporary"), !0) : !1;
  } catch {
    return !1;
  }
}
async function pollMasterAccess(client, assetId) {
  try {
    const res = await getAsset(client, assetId), status = res.data?.master?.status ?? "errored", url = res.data?.master?.url ?? "";
    return status === "ready" ? url : "";
  } catch {
    return "";
  }
}
async function waitForMasterAccess(client, assetId, timeout = 30, interval = 2) {
  const limit = Date.now() + timeout * 1e3;
  for (; Date.now() < limit; ) {
    const url = await pollMasterAccess(client, assetId);
    if (url) return url;
    await new Promise((resolve) => setTimeout(resolve, interval * 1e3));
  }
  return "";
}
const DialogStateContext = React.createContext({
  dialogState: !1,
  setDialogState: () => null
}), DialogStateProvider = ({
  dialogState,
  setDialogState,
  children
}) => /* @__PURE__ */ jsxRuntime.jsx(DialogStateContext.Provider, { value: { dialogState, setDialogState }, children }), useDialogStateContext = () => React.useContext(DialogStateContext), mimeExtGraph = [
  /* Audio */
  ["audio/x-aiff", "aif"],
  ["audio/x-aiff", "aiff"],
  ["audio/basic", "au"],
  ["audio/basic", "snd"],
  ["audio/x-mpegurl", "m3u"],
  ["audio/midi", "midi"],
  ["audio/midi", "mid"],
  ["audio/m4a", "mp3"],
  ["audio/mpeg", "mp3"],
  ["audio/x-pn-realaudio", "ra"],
  ["audio/x-pn-realaudio", "ram"],
  ["audio/x-wav", "wav"],
  ["audio/x-ms-wma", "wma"],
  /* Video */
  ["video/3gpp", "3gp"],
  ["video/x-ms-wmv", "wmv"],
  ["video/x-ms-wmx", "wmx"],
  ["video/mp4", "mp4"],
  ["video/mp4", "m4v"],
  ["video/mp4", "mp4v"],
  ["video/mpeg", "mpeg"],
  ["video/mpeg", "mpg"],
  ["video/quicktime", "mov"],
  ["video/quicktime", "qt"],
  ["video/x-mng", "mng"],
  ["video/x-msvideo", "avi"],
  ["video/x-flv", "flv"],
  ["video/x-ms-asf", "asf"],
  ["video/x-ms-asf", "asx"],
  /* Subtitles */
  ["application/x-subrip", "srt"],
  ["text/vtt", "vtt"],
  ["text/x-ssa", "ssa"],
  ["text/x-ass", "ass"],
  ["application/x-sami", "sami"],
  ["application/x-sami", "smi"],
  ["text/x-microdvd", "sub"],
  ["text/x-microdvd", "vobsub"],
  ["text/x-mpl2", "mpl2"]
];
function mimeToExt(mime) {
  const formattedMime = mime.trim().toLowerCase();
  for (const [_mime, _ext] of mimeExtGraph)
    if (_mime === formattedMime)
      return _ext;
}
async function downloadFile(url, name2 = "untitled", extension = "") {
  if (typeof window > "u")
    throw new Error("downloadFile() can only be called in a browser environment.");
  const response = await fetch(url, { mode: "cors" });
  if (!response.ok)
    throw new Error(`downloadFile() failed to fetch file: ${response.status} ${response.statusText}`);
  const mime = response.headers.get("Content-Type") ?? "";
  let fileExt = extension.trim() || mimeToExt(mime) || "";
  fileExt && (fileExt = `.${fileExt}`);
  let fileName = name2.trim() || "untitled";
  fileExt.length && !fileName.endsWith(fileExt) && (fileName += fileExt);
  const blob = await response.blob(), objectUrl = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement("a");
    anchor.download = fileName, anchor.href = objectUrl, document.body.appendChild(anchor), anchor.click(), document.body.removeChild(anchor);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
function DownloadAssetDialog({ asset, onClose, absolute }) {
  const client = useClient(), [status, setStatus] = React.useState("idle"), { setDialogState } = useDialogStateContext(), dialogId = `DownloadAssetDialog${React.useId()}`, timeout = 120, interval = 2, prepareDownload = async () => {
    const assetId = asset.assetId ?? "";
    setStatus("preparing"), enableMasterAccess(client, assetId).then(
      () => {
        waitForMasterAccess(client, assetId, timeout, interval).then(
          (link) => {
            setStatus(link.length > 0 ? "success" : "error");
          }
        );
      }
    );
  }, handleDownload = async () => {
    const assetId = asset.assetId ?? "", assetName = asset.filename ?? "untitled";
    getAsset(client, assetId).then(
      (res) => {
        closing();
        const url = res.data?.master?.url ?? "";
        downloadFile(url, assetName);
      }
    );
  }, closing = () => {
    onClose && onClose(), setDialogState(!1);
  }, behavior = {
    icon: status === "success" ? icons.DownloadIcon : icons.ResetIcon,
    text: status === "success" ? "Download" : "Retry",
    tone: status === "success" ? "positive" : "critical",
    onClick: status === "success" ? handleDownload : prepareDownload
  };
  return React.useEffect(() => {
    status === "idle" && prepareDownload();
  }), /* @__PURE__ */ jsxRuntime.jsx(
    ui.Dialog,
    {
      id: dialogId,
      header: "Download asset (source)",
      onClose: closing,
      position: absolute ? "fixed" : void 0,
      zOffset: DIALOGS_Z_INDEX,
      footer: /* @__PURE__ */ jsxRuntime.jsx(ui.Stack, { padding: 3, children: /* @__PURE__ */ jsxRuntime.jsx(
        ui.Button,
        {
          icon: behavior.icon,
          disabled: status === "preparing",
          mode: "ghost",
          tone: behavior.tone,
          loading: status === "preparing",
          onClick: behavior.onClick,
          text: behavior.text
        },
        "download"
      ) }),
      children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { paddingX: 5, paddingY: 3, children: [
        /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { hidden: status !== "preparing", align: "center", children: "Your download file is being prepared\u2026" }),
        /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { hidden: status !== "success", align: "center", children: "Your download file is ready." }),
        /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { hidden: status !== "error", align: "center", children: "Something went wrong during preparation :/" })
      ] })
    }
  );
}
const IconInfo = (props) => {
  const Icon = props.icon;
  return /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { gap: 2, align: "center", padding: 1, children: [
    /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: (props.size || 1) + 1, muted: !0, children: /* @__PURE__ */ jsxRuntime.jsx(Icon, {}) }),
    /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: props.size || 1, muted: props.muted, children: props.text })
  ] });
};
function ResolutionIcon(props) {
  return /* @__PURE__ */ jsxRuntime.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "1em", height: "1em", viewBox: "0 0 24 24", ...props, children: /* @__PURE__ */ jsxRuntime.jsx(
    "path",
    {
      fill: "currentColor",
      d: "M20 9V6h-3V4h5v5h-2ZM2 9V4h5v2H4v3H2Zm15 11v-2h3v-3h2v5h-5ZM2 20v-5h2v3h3v2H2Zm4-4V8h12v8H6Zm2-2h8v-4H8v4Zm0 0v-4v4Z"
    }
  ) });
}
function StopWatchIcon(props) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "1em",
      height: "1em",
      viewBox: "0 0 512 512",
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M232 306.667h48V176h-48v130.667z", fill: "currentColor" }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "path",
          {
            d: "M407.67 170.271l30.786-30.786-33.942-33.941-30.785 30.786C341.217 111.057 300.369 96 256 96 149.961 96 64 181.961 64 288s85.961 192 192 192 192-85.961 192-192c0-44.369-15.057-85.217-40.33-117.729zm-45.604 223.795C333.734 422.398 296.066 438 256 438s-77.735-15.602-106.066-43.934C121.602 365.735 106 328.066 106 288s15.602-77.735 43.934-106.066C178.265 153.602 215.934 138 256 138s77.734 15.602 106.066 43.934C390.398 210.265 406 247.934 406 288s-15.602 77.735-43.934 106.066z",
            fill: "currentColor"
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx("path", { d: "M192 32h128v48H192z", fill: "currentColor" })
      ]
    }
  );
}
function useResyncAsset(options) {
  const client = useClient(), toast = ui.useToast(), [resyncState, setResyncState] = React.useState("idle"), [resyncError, setResyncError] = React.useState(null), showToast = options?.showToast ?? !1, resyncAsset = React.useCallback(
    async (asset) => {
      if (!asset.assetId) {
        showToast && toast.push({
          title: "Cannot resync",
          description: "Asset has no Mux ID",
          status: "error"
        }), options?.onError?.(new Error("Asset has no Mux ID"));
        return;
      }
      if (!asset._id) {
        showToast && toast.push({
          title: "Cannot resync",
          description: "Asset has no document ID",
          status: "error"
        }), options?.onError?.(new Error("Asset has no document ID"));
        return;
      }
      setResyncState("syncing"), setResyncError(null);
      try {
        const muxData = (await getAsset(client, asset.assetId)).data, dataWithKeys = addKeysToMuxData(muxData);
        return await client.patch(asset._id).set({
          status: muxData.status,
          data: dataWithKeys,
          ...muxData.meta?.title && { filename: muxData.meta.title }
        }).commit({ returnDocuments: !1 }), setResyncState("success"), showToast && toast.push({
          title: "Asset synced",
          description: "Data has been updated from Mux",
          status: "success"
        }), options?.onSuccess?.(muxData), muxData;
      } catch (error) {
        setResyncState("error"), setResyncError(error), console.error("Failed to refresh asset data:", error), showToast && toast.push({
          title: "Sync failed",
          description: "Could not sync asset from Mux",
          status: "error"
        }), options?.onError?.(error);
        return;
      }
    },
    [client, toast, options, showToast]
  );
  return {
    resyncState,
    resyncError,
    resyncAsset,
    isResyncing: resyncState === "syncing"
  };
}
function extractErrorMessage(error, defaultMessage = "Failed to process request") {
  let message = "";
  if (error && typeof error == "object") {
    const err = error;
    message = err.response?.body?.message || err.message || "";
  } else typeof error == "string" && (message = error);
  if (!message)
    return defaultMessage;
  const match = message.match(/\(([^)]+)\)/);
  if (match && match[1])
    return match[1];
  if (message.includes("responded with")) {
    const parts = message.split("(");
    if (parts.length > 1)
      return parts[parts.length - 1].replace(")", "").trim();
  }
  return message;
}
async function pollTrackStatus(options) {
  const {
    client,
    assetId,
    trackName,
    trackLanguageCode,
    maxAttempts = 10,
    onTrackFound,
    onTrackErrored,
    onTrackReady
  } = options, trimmedName = trackName.trim(), trimmedLanguageCode = trackLanguageCode.trim();
  let newTrack, attempts = 0, trackFound = !1;
  const findTrack = (textTracks) => {
    let foundTrack = textTracks.find(
      (track) => track.name === trimmedName && track.language_code === trimmedLanguageCode
    );
    return foundTrack || (foundTrack = textTracks.find((track) => track.language_code === trimmedLanguageCode)), !foundTrack && textTracks.length > 0 && (foundTrack = textTracks[textTracks.length - 1]), foundTrack;
  };
  for (; attempts < maxAttempts; ) {
    try {
      attempts > 0 && await new Promise((resolve) => setTimeout(resolve, 1e3));
      const textTracks = (await getAsset(client, assetId)).data.tracks?.filter((track) => track.type === "text") || [], foundTrack = findTrack(textTracks);
      if (!foundTrack) {
        attempts++;
        continue;
      }
      if (trackFound = !0, newTrack = foundTrack, onTrackFound && onTrackFound(foundTrack), foundTrack.status === "ready") {
        onTrackReady && onTrackReady(foundTrack);
        break;
      }
      if (foundTrack.status === "errored")
        return onTrackErrored && onTrackErrored(foundTrack), {
          track: foundTrack,
          found: !0,
          status: "errored"
        };
    } catch (error) {
      console.error("Failed to fetch updated asset:", error);
    }
    attempts++;
  }
  return !newTrack || !trackFound ? {
    track: void 0,
    found: !1,
    status: "not-found"
  } : newTrack.status === "preparing" ? {
    track: newTrack,
    found: !0,
    status: "preparing"
  } : {
    track: newTrack,
    found: !0,
    status: "ready"
  };
}
async function downloadVttFile(client, asset, track) {
  if (!track.id)
    throw new Error("Track ID is missing");
  if (track.status !== "ready")
    throw new Error(`Track is not ready yet. Status: ${track.status}`);
  if (!asset.assetId)
    throw new Error("Asset ID is required");
  const playbackId = getPlaybackId(asset);
  if (!playbackId)
    throw new Error("Playback ID is required");
  const playbackPolicy = getPlaybackPolicy(asset)?.policy;
  let downloadUrl = `https://stream.mux.com/${playbackId}/text/${track.id}.vtt`;
  if (playbackPolicy === "signed" || playbackPolicy === "drm") {
    const token = generateJwt(client, playbackId, "v");
    downloadUrl += `?token=${token}`;
  }
  const response = await fetch(downloadUrl);
  if (!response.ok)
    throw new Error(`Failed to download file: ${response.statusText}`);
  const blob = await response.blob(), blobUrl = URL.createObjectURL(blob), link = document.createElement("a");
  link.href = blobUrl, link.download = `${asset.filename || "captions"}-${track.language_code || "en"}.vtt`, document.body.appendChild(link), link.click(), document.body.removeChild(link), URL.revokeObjectURL(blobUrl);
}
const SUPPORTED_MUX_LANGUAGES = [
  { label: "English", code: "en", state: "Stable" },
  { label: "Spanish", code: "es", state: "Stable" },
  { label: "Italian", code: "it", state: "Stable" },
  { label: "Portuguese", code: "pt", state: "Stable" },
  { label: "German", code: "de", state: "Stable" },
  { label: "French", code: "fr", state: "Stable" },
  { label: "Polish", code: "pl", state: "Beta" },
  { label: "Russian", code: "ru", state: "Beta" },
  { label: "Dutch", code: "nl", state: "Beta" },
  { label: "Catalan", code: "ca", state: "Beta" },
  { label: "Turkish", code: "tr", state: "Beta" },
  { label: "Swedish", code: "sv", state: "Beta" },
  { label: "Ukrainian", code: "uk", state: "Beta" },
  { label: "Norwegian", code: "no", state: "Beta" },
  { label: "Finnish", code: "fi", state: "Beta" },
  { label: "Slovak", code: "sk", state: "Beta" },
  { label: "Greek", code: "el", state: "Beta" },
  { label: "Czech", code: "cs", state: "Beta" },
  { label: "Croatian", code: "hr", state: "Beta" },
  { label: "Danish", code: "da", state: "Beta" },
  { label: "Romanian", code: "ro", state: "Beta" },
  { label: "Bulgarian", code: "bg", state: "Beta" }
];
function isCustomTextTrack(track) {
  return track.type !== "autogenerated";
}
function isAutogeneratedTrack(track) {
  return track.type === "autogenerated";
}
const LANGUAGE_OPTIONS$1 = LanguagesList__default.default.getAllCodes().map((code) => ({
  value: code,
  label: LanguagesList__default.default.getNativeName(code)
})), MUX_LANGUAGE_OPTIONS = SUPPORTED_MUX_LANGUAGES.map((lang) => ({
  value: lang.code,
  label: lang.label
}));
function AddCaptionDialog({ asset, onAdd, onClose }) {
  const client = useClient(), toast = ui.useToast(), dialogId = `AddCaptionDialog${React.useId()}`, [isAutogenerated, setIsAutogenerated] = React.useState(!1), [vttUrl, setVttUrl] = React.useState(""), [languageCode, setLanguageCode] = React.useState(""), [selectedLanguage, setSelectedLanguage] = React.useState(
    null
  ), [name2, setName] = React.useState(""), [isSubmitting, setIsSubmitting] = React.useState(!1), [selectedFile, setSelectedFile] = React.useState(null), fileInputRef = React.useRef(null), uploadVttFile = async (file) => (await client.assets.upload("file", file, {
    filename: file.name
  })).url, handleAddTrackFromUrl = async () => {
    if (!asset.assetId)
      throw new Error("Asset ID is required");
    const trimmedName = name2.trim(), trimmedLanguageCode = languageCode.trim();
    let vttUrlToUse = vttUrl.trim();
    if (selectedFile)
      try {
        vttUrlToUse = await uploadVttFile(selectedFile);
      } catch (uploadError) {
        throw toast.push({
          title: "Failed to upload VTT file",
          status: "error",
          description: "Could not upload the VTT file to Sanity. Please try again."
        }), setIsSubmitting(!1), uploadError;
      }
    await addTextTrackFromUrl(client, asset.assetId, vttUrlToUse, {
      language_code: trimmedLanguageCode,
      name: trimmedName,
      text_type: "subtitles"
    });
    const result = await pollTrackStatus({
      client,
      assetId: asset.assetId,
      trackName: trimmedName,
      trackLanguageCode: trimmedLanguageCode,
      onTrackErrored: (track) => {
        const errorMessage = track.error?.messages?.[0] || track.error?.type || "The track failed to download from the provided URL";
        toast.push({
          title: "Caption track failed",
          status: "error",
          description: errorMessage
        }), onAdd(track), onClose();
      }
    });
    if (!result.found || !result.track) {
      toast.push({
        title: "Caption track may have been added",
        status: "warning",
        description: "The track was created but its status could not be determined. It may still be processing. Please refresh the page to see if it appears."
      }), onClose();
      return;
    }
    if (result.status !== "errored") {
      if (result.status === "preparing") {
        toast.push({
          title: "Caption track is processing",
          status: "info",
          description: "The track was created and is being processed. It will appear in the list shortly."
        }), onAdd(result.track), onClose();
        return;
      }
      toast.push({
        title: "Caption track added",
        status: "success",
        description: "Caption track added successfully"
      }), onAdd(result.track), onClose();
    }
  }, handleGenerateSubtitles = async () => {
    if (!asset.assetId)
      throw new Error("Asset ID is required");
    const audioTrack = (await getAsset(client, asset.assetId)).data.tracks?.find((track) => track.type === "audio");
    if (!audioTrack || !audioTrack.id)
      throw toast.push({
        title: "No audio track found",
        status: "error",
        description: "The asset does not have an audio track. Auto-generated subtitles require an audio track."
      }), new Error("No audio track found");
    await generateSubtitles(client, asset.assetId, audioTrack.id, {
      language_code: languageCode.trim(),
      name: name2.trim()
    });
    const mockTrack = {
      type: "text",
      id: `generating-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      text_type: "subtitles",
      text_source: "generated_live",
      language_code: languageCode.trim(),
      name: name2.trim(),
      status: "preparing"
    };
    toast.push({
      title: "Generating subtitles",
      status: "success",
      description: "This may take a few minutes"
    }), onAdd(mockTrack), onClose();
  }, handleSubmit = async () => {
    if (!isAutogenerated) {
      if (!selectedFile && !vttUrl.trim()) {
        toast.push({
          title: "VTT file or URL required",
          status: "error",
          description: "Please select a VTT file or enter a VTT file URL"
        });
        return;
      }
      if (vttUrl.trim() && !selectedFile)
        try {
          new URL(vttUrl.trim());
        } catch {
          toast.push({
            title: "Invalid URL",
            status: "error",
            description: "Please enter a valid URL (e.g., https://example.com/subtitles.vtt)"
          });
          return;
        }
    }
    if (!name2.trim()) {
      toast.push({
        title: "Audio name required",
        status: "error",
        description: "Please enter an audio name for this caption track"
      });
      return;
    }
    if (!languageCode.trim()) {
      toast.push({
        title: "Language code required",
        status: "error",
        description: "Please enter a language code (e.g., en, es, fr)"
      });
      return;
    }
    setIsSubmitting(!0);
    try {
      isAutogenerated ? await handleGenerateSubtitles() : await handleAddTrackFromUrl();
    } catch (error) {
      toast.push({
        title: "Failed to add caption track",
        status: "error",
        description: extractErrorMessage(error, "Failed to add caption track")
      });
    } finally {
      setIsSubmitting(!1);
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.Dialog,
    {
      id: dialogId,
      header: "Add Caption Track",
      onClose,
      width: 1,
      onClickOutside: onClose,
      children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { padding: 4, space: 4, children: [
        /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", marginBottom: 3, children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.Checkbox,
              {
                id: "autogenerated-checkbox",
                style: { display: "block" },
                checked: isAutogenerated,
                onChange: (e) => {
                  setIsAutogenerated(e.currentTarget.checked), e.currentTarget.checked && setVttUrl("");
                },
                disabled: isSubmitting
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Flex, { flex: 1, paddingLeft: 2, children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { children: /* @__PURE__ */ jsxRuntime.jsx("label", { htmlFor: "autogenerated-checkbox", children: "Generate captions" }) }) })
          ] }),
          !isAutogenerated && /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
            /* @__PURE__ */ jsxRuntime.jsxs(ui.Card, { padding: 3, marginBottom: 2, tone: "transparent", border: !0, radius: 2, children: [
              /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", justify: "space-between", children: [
                /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, muted: !0, children: selectedFile ? `Selected: ${selectedFile.name}` : "No file selected" }),
                /* @__PURE__ */ jsxRuntime.jsx(
                  ui.Button,
                  {
                    icon: icons.UploadIcon,
                    text: "Select File",
                    mode: "ghost",
                    tone: "primary",
                    fontSize: 1,
                    padding: 2,
                    onClick: () => fileInputRef.current?.click(),
                    disabled: isSubmitting
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx(
                "input",
                {
                  ref: fileInputRef,
                  type: "file",
                  accept: ".vtt,text/vtt",
                  style: { display: "none" },
                  onChange: (e) => {
                    e.target.files && e.target.files.length > 0 && !isSubmitting && (setSelectedFile(e.target.files[0]), setVttUrl(""));
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, muted: !0, style: { textAlign: "center" }, children: "Or enter the VTT file URL" }),
            /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
              /* @__PURE__ */ jsxRuntime.jsx(ui.Label, { htmlFor: "vtt-url", children: "VTT File URL" }),
              /* @__PURE__ */ jsxRuntime.jsx(
                ui.TextInput,
                {
                  id: "vtt-url",
                  placeholder: "https://example.com/subtitles.vtt",
                  value: vttUrl,
                  onChange: (e) => {
                    setVttUrl(e.currentTarget.value), setSelectedFile(null);
                  },
                  disabled: isSubmitting
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.Label, { htmlFor: "caption-name", children: "Audio name" }),
          /* @__PURE__ */ jsxRuntime.jsx(
            ui.Autocomplete,
            {
              id: "caption-name",
              value: selectedLanguage?.value || "",
              onChange: (newValue) => {
                const selected = (isAutogenerated ? MUX_LANGUAGE_OPTIONS : LANGUAGE_OPTIONS$1).find((opt) => opt.value === newValue);
                selected && (setSelectedLanguage(selected), setLanguageCode(selected.value), setName(selected.label));
              },
              options: isAutogenerated ? MUX_LANGUAGE_OPTIONS : LANGUAGE_OPTIONS$1,
              icon: icons.TranslateIcon,
              placeholder: "Select language",
              filterOption: (query, option) => option.label.toLowerCase().indexOf(query.toLowerCase()) > -1 || option.value.toLowerCase().indexOf(query.toLowerCase()) > -1,
              openButton: !0,
              renderValue: (value) => (isAutogenerated ? MUX_LANGUAGE_OPTIONS : LANGUAGE_OPTIONS$1).find(
                (l) => l.value === value
              )?.label || value,
              renderOption: (option) => /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { "data-as": "button", padding: 3, radius: 2, tone: "inherit", children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: 2, textOverflow: "ellipsis", children: [
                option.label,
                " (",
                option.value,
                ")"
              ] }) }),
              disabled: isSubmitting
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.Label, { htmlFor: "caption-language", children: "Language Code" }),
          /* @__PURE__ */ jsxRuntime.jsx(
            ui.TextInput,
            {
              id: "caption-language",
              placeholder: "en-US",
              value: languageCode,
              onChange: (e) => {
                setLanguageCode(e.currentTarget.value), selectedLanguage && selectedLanguage.value !== e.currentTarget.value && (setSelectedLanguage(null), (!name2 || name2 === selectedLanguage.label) && setName(""));
              },
              disabled: isSubmitting
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { gap: 2, justify: "flex-end", marginTop: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.Button, { text: "Cancel", mode: "ghost", onClick: onClose, disabled: isSubmitting }),
          /* @__PURE__ */ jsxRuntime.jsx(
            ui.Button,
            {
              text: "Add Caption Track",
              tone: "primary",
              icon: isSubmitting ? /* @__PURE__ */ jsxRuntime.jsx(
                ui.Spinner,
                {
                  style: {
                    verticalAlign: "middle",
                    display: "inline-block",
                    marginBottom: "-3px",
                    width: "1em",
                    height: "1em",
                    marginRight: "-6px"
                  }
                }
              ) : /* @__PURE__ */ jsxRuntime.jsx(icons.UploadIcon, {}),
              onClick: handleSubmit,
              disabled: isSubmitting
            }
          )
        ] })
      ] })
    }
  );
}
const LANGUAGE_OPTIONS = LanguagesList__default.default.getAllCodes().map((code) => ({
  value: code,
  label: LanguagesList__default.default.getNativeName(code)
}));
function EditCaptionDialog({ asset, track, onUpdate, onClose }) {
  const client = useClient(), toast = ui.useToast(), dialogId = `EditCaptionDialog${React.useId()}`, isAutogenerated = track.text_source === "generated_live" || track.text_source === "generated_live_final" || track.text_source === "generated_vod", [vttUrl, setVttUrl] = React.useState(""), [languageCode, setLanguageCode] = React.useState(track.language_code || ""), [selectedLanguage, setSelectedLanguage] = React.useState(
    () => {
      const baseCode = track.language_code?.split("-")[0], found = LANGUAGE_OPTIONS.find(
        (opt) => opt.value === track.language_code || opt.value === baseCode
      );
      if (found) return found;
      if (track.name) {
        const foundByName = LANGUAGE_OPTIONS.find((opt) => opt.label === track.name);
        if (foundByName) return foundByName;
      }
      return null;
    }
  ), [name2, setName] = React.useState(track.name || ""), [isSubmitting, setIsSubmitting] = React.useState(!1), [downloading, setDownloading] = React.useState(!1), [selectedFile, setSelectedFile] = React.useState(null), fileInputRef = React.useRef(null);
  React.useEffect(() => {
    setLanguageCode(track.language_code || ""), setName(track.name || ""), setVttUrl("");
    const baseCode = track.language_code?.split("-")[0], foundByCode = LANGUAGE_OPTIONS.find(
      (opt) => opt.value === track.language_code || opt.value === baseCode
    ), foundByName = track.name ? LANGUAGE_OPTIONS.find((opt) => opt.label === track.name) : null;
    setSelectedLanguage(foundByCode || foundByName || null);
  }, [track, asset, client]);
  const handleDownloadCurrentFile = async () => {
    setDownloading(!0);
    try {
      await downloadVttFile(client, asset, track);
    } catch (error) {
      let errorMessage = "Please try again", title = "Failed to download VTT file";
      error instanceof Error ? (errorMessage = error.message, error.message.includes("Track") && (title = "Cannot download")) : (error === "Track ID is missing" || error === "Track is not ready yet") && (errorMessage = String(error), title = "Cannot download"), toast.push({
        title,
        status: "error",
        description: errorMessage
      });
    } finally {
      setDownloading(!1);
    }
  }, getCurrentFileName = () => track.id && asset.filename ? `${asset.filename}-${track.language_code || "en"}.vtt` : `captions-${track.language_code || "en"}.vtt`, uploadVttFile = async (file) => (await client.assets.upload("file", file, {
    filename: file.name
  })).url, refreshAssetData = async () => {
    if (!(!asset._id || !asset.assetId))
      try {
        const latestAssetData = await getAsset(client, asset.assetId);
        await client.patch(asset._id).set({ data: latestAssetData.data, status: latestAssetData.data.status }).commit();
      } catch (refreshError) {
        console.error("Failed to refresh asset data:", refreshError);
      }
  }, handleUpdateTrackWithNewUrl = async () => {
    if (!asset.assetId)
      throw new Error("Asset ID is required");
    const trimmedName = name2.trim(), trimmedLanguageCode = languageCode.trim(), oldTrackId = track.id;
    try {
      await deleteTextTrack(client, asset.assetId, oldTrackId);
    } catch (deleteError) {
      throw toast.push({
        title: "Failed to delete old track",
        status: "error",
        description: "Could not delete the old track. Please try again or delete it manually."
      }), setIsSubmitting(!1), deleteError;
    }
    let vttUrlToUse = vttUrl.trim();
    if (selectedFile)
      try {
        vttUrlToUse = await uploadVttFile(selectedFile);
      } catch (uploadError) {
        throw toast.push({
          title: "Failed to upload VTT file",
          status: "error",
          description: "Could not upload the VTT file to Sanity. Please try again."
        }), setIsSubmitting(!1), uploadError;
      }
    try {
      await addTextTrackFromUrl(client, asset.assetId, vttUrlToUse, {
        language_code: trimmedLanguageCode,
        name: trimmedName,
        text_type: "subtitles"
      });
    } catch (error) {
      throw toast.push({
        title: "Failed to update caption track",
        status: "error",
        description: extractErrorMessage(error, "Failed to update caption track")
      }), setIsSubmitting(!1), error;
    }
    const result = await pollTrackStatus({
      client,
      assetId: asset.assetId,
      trackName: trimmedName,
      trackLanguageCode: trimmedLanguageCode,
      onTrackErrored: async (erroredTrack) => {
        const errorMessage = erroredTrack.error?.messages?.[0] || erroredTrack.error?.type || "The track failed to download from the provided URL";
        toast.push({
          title: "Caption track failed",
          status: "error",
          description: errorMessage
        }), await refreshAssetData(), onUpdate(erroredTrack, oldTrackId), setIsSubmitting(!1);
      }
    });
    if (!result.found || !result.track) {
      toast.push({
        title: "Caption track may have been updated",
        status: "warning",
        description: "The track was updated but its status could not be determined. It may still be processing. Please refresh the page to see if it appears."
      }), setIsSubmitting(!1);
      return;
    }
    result.status !== "errored" && (await refreshAssetData(), result.status === "preparing" ? toast.push({
      title: "Caption track is processing",
      status: "info",
      description: "The track was updated and is being processed. It will appear in the list shortly."
    }) : toast.push({
      title: "Caption track updated",
      status: "success",
      description: "Caption track updated successfully"
    }), onUpdate(result.track, oldTrackId), setIsSubmitting(!1));
  }, handleSubmit = async () => {
    if (!name2.trim()) {
      toast.push({
        title: "Audio name required",
        status: "error",
        description: "Please enter an audio name for this caption track"
      });
      return;
    }
    if (!languageCode.trim()) {
      toast.push({
        title: "Language code required",
        status: "error",
        description: "Please enter a language code (e.g., en, es, fr)"
      });
      return;
    }
    setIsSubmitting(!0);
    try {
      if (!asset.assetId)
        throw new Error("Asset ID is required");
      const originalVttUrl = (() => {
        if (isAutogenerated || !track.id) return "";
        const playbackId = getPlaybackId(asset);
        if (!playbackId) return "";
        let url = `https://stream.mux.com/${playbackId}/text/${track.id}.vtt`;
        if (getPlaybackPolicy(asset)?.policy === "signed") {
          const token = generateJwt(client, playbackId, "v");
          url += `?token=${token}`;
        }
        return url;
      })(), urlChanged = selectedFile !== null || vttUrl.trim() && vttUrl.trim() !== originalVttUrl;
      if (!urlChanged) {
        toast.push({
          title: "No changes",
          status: "info",
          description: 'Please provide a new VTT file or URL using the "Replace" button or URL field to update the track.'
        }), setIsSubmitting(!1);
        return;
      }
      if (urlChanged) {
        if (!selectedFile && vttUrl.trim())
          try {
            new URL(vttUrl.trim());
          } catch {
            toast.push({
              title: "Invalid URL",
              status: "error",
              description: "Please enter a valid URL (e.g., https://example.com/subtitles.vtt)"
            }), setIsSubmitting(!1);
            return;
          }
        if (!selectedFile && !vttUrl.trim()) {
          toast.push({
            title: "VTT file or URL required",
            status: "error",
            description: "Please select a VTT file or enter a VTT file URL"
          }), setIsSubmitting(!1);
          return;
        }
        await handleUpdateTrackWithNewUrl();
      }
      onClose();
    } catch (error) {
      toast.push({
        title: "Failed to update caption track",
        status: "error",
        description: error instanceof Error ? error.message : "Please try again"
      });
    } finally {
      setIsSubmitting(!1);
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.Dialog,
    {
      id: dialogId,
      header: "Edit Caption Track",
      onClose,
      width: 1,
      onClickOutside: onClose,
      children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { padding: 4, space: 4, children: [
        /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Card, { padding: 3, marginBottom: 2, tone: "transparent", border: !0, radius: 2, children: [
            /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", justify: "space-between", children: [
              /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { children: getCurrentFileName() }),
              /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { gap: 2, children: [
                track.status !== "errored" && /* @__PURE__ */ jsxRuntime.jsx(
                  ui.Button,
                  {
                    icon: downloading ? /* @__PURE__ */ jsxRuntime.jsx(
                      ui.Spinner,
                      {
                        style: {
                          verticalAlign: "middle",
                          display: "inline-block",
                          marginTop: "-2px",
                          width: "0.5em",
                          height: "0.5em"
                        }
                      }
                    ) : /* @__PURE__ */ jsxRuntime.jsx(icons.DownloadIcon, {}),
                    text: "Download",
                    mode: "ghost",
                    tone: "primary",
                    fontSize: 1,
                    padding: 2,
                    onClick: handleDownloadCurrentFile,
                    disabled: downloading || isSubmitting
                  }
                ),
                /* @__PURE__ */ jsxRuntime.jsx(
                  ui.Button,
                  {
                    icon: icons.UploadIcon,
                    text: "Replace",
                    mode: "ghost",
                    tone: "primary",
                    fontSize: 1,
                    padding: 2,
                    onClick: () => fileInputRef.current?.click(),
                    disabled: isSubmitting
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                accept: ".vtt,text/vtt",
                style: { display: "none" },
                onChange: (e) => {
                  e.target.files && e.target.files.length > 0 && !isSubmitting && (setSelectedFile(e.target.files[0]), setVttUrl(""));
                }
              }
            ),
            selectedFile && /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: 1, muted: !0, style: { marginTop: 8 }, children: [
              "Selected: ",
              selectedFile.name
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
            /* @__PURE__ */ jsxRuntime.jsx(ui.Label, { htmlFor: "vtt-url", children: "VTT File URL" }),
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.TextInput,
              {
                id: "vtt-url",
                placeholder: "https://example.com/subtitles.vtt",
                value: vttUrl,
                onChange: (e) => {
                  setVttUrl(e.currentTarget.value), setSelectedFile(null);
                },
                disabled: isSubmitting
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, muted: !0, children: "Add a URL to replace the existing VTT file with a new one" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.Label, { htmlFor: "caption-name", children: "Audio name" }),
          /* @__PURE__ */ jsxRuntime.jsx(
            ui.Autocomplete,
            {
              id: "caption-name",
              value: selectedLanguage?.value || "",
              onChange: (newValue) => {
                const selected = LANGUAGE_OPTIONS.find((opt) => opt.value === newValue);
                selected && (setSelectedLanguage(selected), setLanguageCode(selected.value), setName(selected.label));
              },
              options: LANGUAGE_OPTIONS,
              icon: icons.TranslateIcon,
              placeholder: "Select language",
              filterOption: (query, option) => option.label.toLowerCase().indexOf(query.toLowerCase()) > -1 || option.value.toLowerCase().indexOf(query.toLowerCase()) > -1,
              openButton: !0,
              renderValue: (value) => LANGUAGE_OPTIONS.find((l) => l.value === value)?.label || value,
              renderOption: (option) => /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { "data-as": "button", padding: 3, radius: 2, tone: "inherit", children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: 2, textOverflow: "ellipsis", children: [
                option.label,
                " (",
                option.value,
                ")"
              ] }) }),
              disabled: isSubmitting
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.Label, { htmlFor: "caption-language", children: "Language Code" }),
          /* @__PURE__ */ jsxRuntime.jsx(
            ui.TextInput,
            {
              id: "caption-language",
              placeholder: "en-US",
              value: languageCode,
              onChange: (e) => {
                setLanguageCode(e.currentTarget.value), selectedLanguage && selectedLanguage.value !== e.currentTarget.value && (setSelectedLanguage(null), (!name2 || name2 === selectedLanguage.label) && setName(""));
              },
              disabled: isSubmitting
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { gap: 2, justify: "flex-end", marginTop: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.Button, { text: "Cancel", mode: "ghost", onClick: onClose, disabled: isSubmitting }),
          /* @__PURE__ */ jsxRuntime.jsx(
            ui.Button,
            {
              text: "Update Caption Track",
              tone: "primary",
              icon: isSubmitting ? /* @__PURE__ */ jsxRuntime.jsx(
                ui.Spinner,
                {
                  style: {
                    verticalAlign: "middle",
                    display: "inline-block",
                    marginBottom: "-3px",
                    width: "1em",
                    height: "1em",
                    marginRight: "-6px"
                  }
                }
              ) : icons.UploadIcon,
              onClick: handleSubmit,
              disabled: isSubmitting
            }
          )
        ] })
      ] })
    }
  );
}
function TrackCard({
  track,
  iconOnly,
  downloadingTrackId,
  deletingTrackId,
  trackToEdit,
  getTrackSourceLabel,
  handleDownload,
  setTrackToEdit,
  setTrackToDelete
}) {
  const isDisabled = (action) => action === "download" ? downloadingTrackId !== null || deletingTrackId === track.id || trackToEdit?.id === track.id : action === "edit" ? downloadingTrackId === track.id || deletingTrackId === track.id || trackToEdit?.id === track.id : downloadingTrackId === track.id || deletingTrackId !== null || trackToEdit?.id === track.id, renderActionButtons = () => track.status === "preparing" ? /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", gap: 2, children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      ui.Spinner,
      {
        muted: !0,
        style: {
          width: "0.75em",
          height: "0.75em",
          verticalAlign: "middle",
          display: "inline-block",
          marginBottom: "-2px"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, muted: !0, children: "Processing..." })
  ] }) : /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { gap: 2, children: [
    track.status !== "errored" && /* @__PURE__ */ jsxRuntime.jsx(
      ui.Button,
      {
        icon: downloadingTrackId === track.id ? /* @__PURE__ */ jsxRuntime.jsx(
          ui.Spinner,
          {
            style: {
              verticalAlign: "middle",
              display: "inline-block",
              marginTop: "-2px",
              width: "0.5em",
              height: "0.5em"
            }
          }
        ) : /* @__PURE__ */ jsxRuntime.jsx(icons.DownloadIcon, {}),
        text: iconOnly ? void 0 : "Download",
        mode: "ghost",
        tone: "primary",
        fontSize: 1,
        padding: 2,
        onClick: () => handleDownload(track),
        disabled: isDisabled("download"),
        title: "Download"
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      ui.Button,
      {
        icon: /* @__PURE__ */ jsxRuntime.jsx(icons.EditIcon, {}),
        text: iconOnly ? void 0 : "Edit",
        mode: "ghost",
        tone: "primary",
        fontSize: 1,
        padding: 2,
        disabled: isDisabled("edit"),
        onClick: () => setTrackToEdit(track),
        title: "Edit"
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      ui.Button,
      {
        icon: deletingTrackId === track.id ? /* @__PURE__ */ jsxRuntime.jsx(
          ui.Spinner,
          {
            style: {
              verticalAlign: "middle",
              display: "inline-block",
              marginTop: "-2px",
              width: "0.5em",
              height: "0.5em"
            }
          }
        ) : /* @__PURE__ */ jsxRuntime.jsx(icons.TrashIcon, {}),
        text: iconOnly ? void 0 : "Delete",
        mode: "ghost",
        tone: "critical",
        fontSize: 1,
        padding: 2,
        disabled: isDisabled("delete"),
        onClick: () => setTrackToDelete(track),
        title: "Delete"
      }
    )
  ] });
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.Card,
    {
      padding: 3,
      radius: 2,
      tone: track.status === "errored" ? "caution" : "transparent",
      border: !0,
      children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", justify: "space-between", gap: 3, children: [
        /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, flex: 1, children: [
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", gap: 2, children: [
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { weight: "semibold", children: track.name || "Untitled" }),
            /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: 1, muted: !0, children: [
              "(",
              getTrackSourceLabel(track),
              ")"
            ] }),
            track.status === "errored" && /* @__PURE__ */ jsxRuntime.jsx(
              icons.ErrorOutlineIcon,
              {
                style: { color: "var(--card-critical-color)" },
                "aria-label": "Error",
                fontSize: 20
              }
            )
          ] }),
          track.language_code && /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: 1, muted: !0, children: [
            "Language: ",
            track.language_code
          ] }),
          track.status === "errored" && track.error && /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, style: { color: "var(--card-critical-color)" }, children: track.error.messages?.[0] || track.error.type || "Failed to process track" })
        ] }),
        renderActionButtons()
      ] })
    }
  );
}
function TextTracksManager({
  asset,
  iconOnly = !1,
  tracks: propTracks,
  collapseTracks = !1
}) {
  const client = useClient(), toast = ui.useToast(), dialogId = `DeleteCaptionDialog${React.useId()}`, { resyncAsset } = useResyncAsset(), [downloadingTrackId, setDownloadingTrackId] = React.useState(null), [deletingTrackId, setDeletingTrackId] = React.useState(null), [addedTracks, setAddedTracks] = React.useState([]), [updatedTracks, setUpdatedTracks] = React.useState(/* @__PURE__ */ new Map()), [trackActivityOrder, setTrackActivityOrder] = React.useState(/* @__PURE__ */ new Map()), [autogeneratedTrackIds, setAutogeneratedTrackIds] = React.useState(/* @__PURE__ */ new Set()), [trackToDelete, setTrackToDelete] = React.useState(null), [trackToEdit, setTrackToEdit] = React.useState(null), [showAddDialog, setShowAddDialog] = React.useState(!1), [isExpanded, setIsExpanded] = React.useState(!1), MAX_VISIBLE_TRACKS = 4, activeTracks = (propTracks || asset.data?.tracks?.filter((track) => track.type === "text") || []).filter(
    (track) => track.id && (track.status === "ready" || track.status === "preparing" || track.status === "errored")
  ), allTracks = React.useMemo(() => {
    const tracksWithUpdates = activeTracks.map((track) => updatedTracks.get(track.id) || track), isMockTrackReplaced = (mockTrack, realTracksList) => !mockTrack.id || !mockTrack.id.startsWith("generating-") ? !1 : realTracksList.some((realTrack) => {
      const nameMatches = realTrack.name === mockTrack.name, languageMatches = realTrack.language_code === mockTrack.language_code;
      return !nameMatches || !languageMatches ? !1 : realTrack.status === "ready" ? realTrack.text_source === "generated_live" || realTrack.text_source === "generated_live_final" || realTrack.text_source === "generated_vod" : realTrack.status === "preparing";
    }), isTrackAlreadyInRealTracks = (addedTrack, realTracksList) => addedTrack.id ? addedTrack.id.startsWith("generating-") ? isMockTrackReplaced(addedTrack, realTracksList) : realTracksList.some((realTrack) => realTrack.id === addedTrack.id) : !1, tracksToKeep = addedTracks.filter((addedTrack) => addedTrack.id && addedTrack.id.startsWith("generating-") ? !isMockTrackReplaced(addedTrack, tracksWithUpdates) : !isTrackAlreadyInRealTracks(addedTrack, tracksWithUpdates));
    return [...tracksWithUpdates, ...tracksToKeep];
  }, [activeTracks, addedTracks, updatedTracks]);
  React.useEffect(() => {
    const newAutogeneratedIds = /* @__PURE__ */ new Set();
    activeTracks.forEach((track) => {
      track.id && (track.text_source === "generated_live" || track.text_source === "generated_live_final" || track.text_source === "generated_vod") && newAutogeneratedIds.add(track.id);
    }), addedTracks.forEach((mockTrack) => {
      if (mockTrack.id && mockTrack.id.startsWith("generating-")) {
        const realTrack = activeTracks.find((rt) => {
          const nameMatches = rt.name === mockTrack.name, languageMatches = rt.language_code === mockTrack.language_code;
          return nameMatches && languageMatches;
        });
        realTrack?.id && newAutogeneratedIds.add(realTrack.id);
      }
    }), setAutogeneratedTrackIds((prev) => {
      let hasNew = !1;
      const updated = new Set(prev);
      return newAutogeneratedIds.forEach((id) => {
        prev.has(id) || (updated.add(id), hasNew = !0);
      }), hasNew ? updated : prev;
    });
  }, [activeTracks, addedTracks]), React.useEffect(() => {
    if (allTracks.filter((track) => track.status === "preparing").length === 0 || !asset.assetId || !asset._id)
      return;
    const interval = setInterval(async () => {
      try {
        const muxData = await resyncAsset(asset);
        if (!muxData) return;
        const fetchedTracks = muxData.tracks?.filter((track) => track.type === "text") || [], isMockTrackReplaced = (mockTrack, fetchedTracksList) => !mockTrack.id || !mockTrack.id.startsWith("generating-") ? !1 : fetchedTracksList.some((realTrack) => {
          const nameMatches = realTrack.name === mockTrack.name, languageMatches = realTrack.language_code === mockTrack.language_code;
          return !nameMatches || !languageMatches ? !1 : realTrack.status === "ready" ? realTrack.text_source === "generated_live" || realTrack.text_source === "generated_live_final" || realTrack.text_source === "generated_vod" : realTrack.status === "preparing";
        }), newAutogeneratedIds = /* @__PURE__ */ new Set();
        fetchedTracks.forEach((track) => {
          track.id && (track.text_source === "generated_live" || track.text_source === "generated_live_final" || track.text_source === "generated_vod") && newAutogeneratedIds.add(track.id);
        });
        const findMatchingRealTrack = (mockTrack, tracksList) => tracksList.find((rt) => {
          const nameMatches = rt.name === mockTrack.name, languageMatches = rt.language_code === mockTrack.language_code;
          return nameMatches && languageMatches;
        });
        setAddedTracks((prev) => prev.filter((mockTrack) => {
          if (mockTrack.id && mockTrack.id.startsWith("generating-")) {
            const replaced = isMockTrackReplaced(mockTrack, fetchedTracks);
            if (replaced) {
              const realTrack = findMatchingRealTrack(mockTrack, fetchedTracks);
              realTrack?.id && (newAutogeneratedIds.add(realTrack.id), setTrackActivityOrder((prevOrder) => {
                const mockOrder = prevOrder.get(mockTrack.id);
                if (mockOrder) {
                  const newMap = new Map(prevOrder);
                  return newMap.set(realTrack.id, mockOrder), newMap;
                }
                return prevOrder;
              }));
            }
            return !replaced;
          }
          return !0;
        })), newAutogeneratedIds.size > 0 && setAutogeneratedTrackIds((prevIds) => {
          const updated = new Set(prevIds);
          return newAutogeneratedIds.forEach((id) => updated.add(id)), updated;
        });
      } catch (error) {
        console.error("Failed to refresh asset data:", error);
      }
    }, 3e3);
    return () => clearInterval(interval);
  }, [allTracks, asset, resyncAsset]);
  const visibleTracks = allTracks.filter(
    (track) => track.status === "ready" || track.status === "preparing" || track.status === "errored"
  ).sort((a2, b) => {
    const orderA = trackActivityOrder.get(a2.id) || 0, orderB = trackActivityOrder.get(b.id) || 0;
    if (orderA > 0 && orderB > 0)
      return orderB - orderA;
    if (orderA > 0) return -1;
    if (orderB > 0) return 1;
    const aIsPreparing = a2.status === "preparing", bIsPreparing = b.status === "preparing";
    if (aIsPreparing && !bIsPreparing) return -1;
    if (!aIsPreparing && bIsPreparing) return 1;
    const aIsAutogenerated = a2.id && a2.id.startsWith("generating-") || a2.id && autogeneratedTrackIds.has(a2.id), bIsAutogenerated = b.id && b.id.startsWith("generating-") || b.id && autogeneratedTrackIds.has(b.id);
    return aIsAutogenerated && !bIsAutogenerated ? -1 : !aIsAutogenerated && bIsAutogenerated ? 1 : 0;
  }), handleDownload = async (track) => {
    if (track.id) {
      setDownloadingTrackId(track.id);
      try {
        await downloadVttFile(client, asset, track);
      } catch (error) {
        toast.push({
          title: "Failed to download VTT file",
          status: "error",
          description: error instanceof Error ? error.message : "Please try again"
        });
      } finally {
        setDownloadingTrackId(null);
      }
    }
  }, confirmDelete = async () => {
    if (!trackToDelete || !trackToDelete.id) return;
    const track = trackToDelete;
    setTrackToDelete(null), setDeletingTrackId(track.id);
    try {
      if (!asset.assetId)
        throw new Error("Asset ID is required");
      await deleteTextTrack(client, asset.assetId, track.id), await resyncAsset(asset), toast.push({
        title: "Successfully deleted caption track",
        status: "success"
      }), setAddedTracks((prev) => prev.filter((t) => t.id !== track.id)), setUpdatedTracks((prev) => {
        const newMap = new Map(prev);
        return newMap.delete(track.id), newMap;
      }), setTrackActivityOrder((prev) => {
        const newMap = new Map(prev);
        return newMap.delete(track.id), newMap;
      }), setAutogeneratedTrackIds((prev) => {
        const updated = new Set(prev);
        return updated.delete(track.id), updated;
      });
    } catch (error) {
      toast.push({
        title: "Failed to delete caption track",
        status: "error",
        description: error instanceof Error ? error.message : "Please try again"
      });
    } finally {
      setDeletingTrackId(null);
    }
  }, handleAddTrack = (track) => {
    setAddedTracks((prev) => [...prev, track]), setTrackActivityOrder((prev) => {
      const newMap = new Map(prev);
      return newMap.set(track.id, prev.size + 1), newMap;
    }), setShowAddDialog(!1);
  }, handleUpdateTrack = async (updatedTrack, oldTrackId) => {
    oldTrackId && (setAddedTracks((prev) => prev.filter((t) => t.id !== oldTrackId)), setUpdatedTracks((prev) => {
      const newMap = new Map(prev);
      return newMap.delete(oldTrackId), newMap;
    }), setTrackActivityOrder((prev) => {
      const newMap = new Map(prev);
      return newMap.delete(oldTrackId), newMap;
    }), setAutogeneratedTrackIds((prev) => {
      const updated = new Set(prev);
      return updated.delete(oldTrackId), updated;
    })), addedTracks.some((t) => t.id === updatedTrack.id) ? setAddedTracks((prev) => prev.map((t) => t.id === updatedTrack.id ? updatedTrack : t)) : setUpdatedTracks((prev) => {
      const newMap = new Map(prev);
      return newMap.set(updatedTrack.id, updatedTrack), newMap;
    }), setTrackActivityOrder((prev) => {
      const newMap = new Map(prev);
      return newMap.set(updatedTrack.id, prev.size + 1), newMap;
    }), setTrackToEdit(null), await resyncAsset(asset);
  }, getTrackSourceLabel = (track) => track.id && track.id.startsWith("generating-") || track.id && autogeneratedTrackIds.has(track.id) || track.text_source === "generated_live_final" || track.text_source === "generated_live" || track.text_source === "generated_vod" ? "Auto-generated" : track.text_source === "uploaded" ? "Uploaded" : "Custom";
  if (visibleTracks.length === 0 && !showAddDialog)
    return /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 3, children: [
      /* @__PURE__ */ jsxRuntime.jsx(ui.Flex, { justify: "flex-end", children: /* @__PURE__ */ jsxRuntime.jsx(
        ui.Button,
        {
          icon: icons.AddIcon,
          text: "Add Caption",
          tone: "primary",
          onClick: () => setShowAddDialog(!0)
        }
      ) }),
      /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { padding: 4, radius: 2, tone: "transparent", border: !0, children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, muted: !0, children: "No captions available. Add captions when uploading a video or add them manually." }) }),
      showAddDialog && /* @__PURE__ */ jsxRuntime.jsx(
        AddCaptionDialog,
        {
          asset,
          onAdd: handleAddTrack,
          onClose: () => setShowAddDialog(!1)
        }
      )
    ] });
  const displayedTracks = collapseTracks && !isExpanded ? visibleTracks.slice(0, MAX_VISIBLE_TRACKS) : visibleTracks, hasMoreTracks = collapseTracks && visibleTracks.length > MAX_VISIBLE_TRACKS;
  return /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 3, children: [
    /* @__PURE__ */ jsxRuntime.jsx(ui.Flex, { justify: "flex-end", children: /* @__PURE__ */ jsxRuntime.jsx(
      ui.Button,
      {
        icon: icons.AddIcon,
        text: "Add Caption",
        tone: "primary",
        onClick: () => setShowAddDialog(!0)
      }
    ) }),
    displayedTracks.map((track) => /* @__PURE__ */ jsxRuntime.jsx(
      TrackCard,
      {
        track,
        iconOnly,
        downloadingTrackId,
        deletingTrackId,
        trackToEdit,
        getTrackSourceLabel,
        handleDownload,
        setTrackToEdit,
        setTrackToDelete
      },
      track.id
    )),
    hasMoreTracks && /* @__PURE__ */ jsxRuntime.jsx(ui.Flex, { justify: "center", children: /* @__PURE__ */ jsxRuntime.jsx(
      ui.Button,
      {
        icon: isExpanded ? icons.ChevronUpIcon : icons.ChevronDownIcon,
        text: isExpanded ? "Show less" : `Show ${visibleTracks.length - MAX_VISIBLE_TRACKS} more`,
        mode: "ghost",
        tone: "primary",
        onClick: () => setIsExpanded(!isExpanded)
      }
    ) }),
    trackToDelete && /* @__PURE__ */ jsxRuntime.jsx(
      ui.Dialog,
      {
        animate: !0,
        id: dialogId,
        header: "Delete track",
        onClose: () => setTrackToDelete(null),
        onClickOutside: () => setTrackToDelete(null),
        width: 1,
        children: /* @__PURE__ */ jsxRuntime.jsx(
          ui.Card,
          {
            padding: 3,
            style: {
              minHeight: "150px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            },
            children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 3, children: [
              /* @__PURE__ */ jsxRuntime.jsxs(ui.Heading, { size: 2, children: [
                'Are you sure you want to delete "',
                trackToDelete.name || trackToDelete.language_code || "Untitled",
                '"?'
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 2, children: "This action is irreversible" }),
              /* @__PURE__ */ jsxRuntime.jsx(ui.Stack, { space: 4, marginY: 4, children: /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { children: /* @__PURE__ */ jsxRuntime.jsx(
                ui.Button,
                {
                  icon: deletingTrackId === trackToDelete.id ? /* @__PURE__ */ jsxRuntime.jsx(
                    ui.Spinner,
                    {
                      style: {
                        verticalAlign: "middle",
                        display: "inline-block",
                        marginTop: "-2px",
                        width: "0.5em",
                        height: "0.5em"
                      }
                    }
                  ) : /* @__PURE__ */ jsxRuntime.jsx(icons.TrashIcon, {}),
                  fontSize: 2,
                  padding: 3,
                  text: "Delete track",
                  tone: "critical",
                  onClick: confirmDelete,
                  disabled: deletingTrackId !== null
                }
              ) }) })
            ] })
          }
        )
      }
    ),
    showAddDialog && /* @__PURE__ */ jsxRuntime.jsx(
      AddCaptionDialog,
      {
        asset,
        onAdd: handleAddTrack,
        onClose: () => setShowAddDialog(!1)
      }
    ),
    trackToEdit && /* @__PURE__ */ jsxRuntime.jsx(
      EditCaptionDialog,
      {
        asset,
        track: trackToEdit,
        onUpdate: handleUpdateTrack,
        onClose: () => setTrackToEdit(null)
      }
    )
  ] });
}
function getVideoSrc({ client, muxPlaybackId: muxPlaybackId2 }) {
  const searchParams = new URLSearchParams();
  if (muxPlaybackId2.policy === "signed" || muxPlaybackId2.policy === "drm") {
    const token = generateJwt(client, muxPlaybackId2.id, "v");
    searchParams.set("token", token);
  }
  return `https://stream.mux.com/${muxPlaybackId2.id}.m3u8?${searchParams}`;
}
function CaptionsDialog({ asset }) {
  const { setDialogState } = useDialogStateContext(), dialogId = `CaptionsDialog${React.useId()}`;
  return /* @__PURE__ */ jsxRuntime.jsx(ui.Dialog, { id: dialogId, header: "Edit Captions", onClose: () => setDialogState(!1), width: 1, children: /* @__PURE__ */ jsxRuntime.jsx(ui.Stack, { padding: 4, children: /* @__PURE__ */ jsxRuntime.jsx(TextTracksManager, { asset }) }) });
}
function getDevicePixelRatio(options) {
  const {
    defaultDpr = 1,
    maxDpr = 3,
    round = !0
  } = options || {}, dpr = typeof window < "u" && typeof window.devicePixelRatio == "number" ? window.devicePixelRatio : defaultDpr;
  return Math.min(Math.max(1, round ? Math.floor(dpr) : dpr), maxDpr);
}
function formatSeconds(seconds) {
  if (typeof seconds != "number" || Number.isNaN(seconds))
    return "";
  const hrs = ~~(seconds / 3600), mins = ~~(seconds % 3600 / 60), secs = ~~seconds % 60;
  let ret = "";
  return hrs > 0 && (ret += "" + hrs + ":" + (mins < 10 ? "0" : "")), ret += "" + mins + ":" + (secs < 10 ? "0" : ""), ret += "" + secs, ret;
}
function formatSecondsToHHMMSS(seconds) {
  const hrs = Math.floor(seconds / 3600).toString().padStart(2, "0"), mins = Math.floor(seconds % 3600 / 60).toString().padStart(2, "0"), secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
}
function isValidTimeFormat(time) {
  return /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/.test(time) || time === "";
}
function getSecondsFromTimeFormat(time) {
  const [hh = 0, mm = 0, ss = 0] = time.split(":").map(Number);
  return hh * 3600 + mm * 60 + ss;
}
function EditThumbnailDialog({ asset, currentTime = 0 }) {
  const client = useClient(), { setDialogState } = useDialogStateContext(), dialogId = `EditThumbnailDialog${React.useId()}`, [timeFormatted, setTimeFormatted] = React.useState(
    () => formatSecondsToHHMMSS(currentTime)
  ), [nextTime, setNextTime] = React.useState(currentTime), [inputError, setInputError] = React.useState(""), assetWithNewThumbnail = React.useMemo(() => ({ ...asset, thumbTime: nextTime }), [asset, nextTime]), [saving, setSaving] = React.useState(!1), [saveThumbnailError, setSaveThumbnailError] = React.useState(null), handleSave = () => {
    setSaving(!0), client.patch(asset._id).set({ thumbTime: nextTime }).commit({ returnDocuments: !1 }).then(() => void setDialogState(!1)).catch(setSaveThumbnailError).finally(() => void setSaving(!1));
  }, width = 300 * getDevicePixelRatio({ maxDpr: 2 });
  if (saveThumbnailError)
    throw saveThumbnailError;
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.Dialog,
    {
      id: dialogId,
      header: "Edit thumbnail",
      onClose: () => setDialogState(!1),
      footer: /* @__PURE__ */ jsxRuntime.jsx(ui.Stack, { padding: 3, children: /* @__PURE__ */ jsxRuntime.jsx(
        ui.Button,
        {
          disabled: inputError !== "",
          mode: "ghost",
          tone: "primary",
          loading: saving,
          onClick: handleSave,
          text: "Set new thumbnail"
        },
        "thumbnail"
      ) }),
      children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 3, padding: 3, children: [
        /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, weight: "semibold", children: "Current:" }),
          /* @__PURE__ */ jsxRuntime.jsx(VideoThumbnail, { asset, width, staticImage: !0 })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, weight: "semibold", children: "New:" }),
          /* @__PURE__ */ jsxRuntime.jsx(VideoThumbnail, { asset: assetWithNewThumbnail, width, staticImage: !0 })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(ui.Stack, { space: 2, children: /* @__PURE__ */ jsxRuntime.jsx(ui.Flex, { align: "center", justify: "center", children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 5, weight: "semibold", children: "Or" }) }) }),
        /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, weight: "semibold", children: "Selected time for thumbnail (hh:mm:ss):" }),
          /* @__PURE__ */ jsxRuntime.jsx(
            ui.TextInput,
            {
              size: 1,
              value: timeFormatted,
              placeholder: "hh:mm:ss",
              onChange: (event) => {
                const value = event.currentTarget.value;
                if (setTimeFormatted(value), isValidTimeFormat(value)) {
                  setInputError("");
                  const totalSeconds = getSecondsFromTimeFormat(value);
                  setNextTime(totalSeconds);
                } else
                  setInputError("Invalid time format");
              },
              customValidity: inputError
            }
          )
        ] })
      ] })
    }
  );
}
function AudioIcon(props) {
  return /* @__PURE__ */ jsxRuntime.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "1em", height: "1em", viewBox: "0 0 24 24", ...props, children: /* @__PURE__ */ jsxRuntime.jsx(
    "path",
    {
      fill: "currentColor",
      style: { opacity: "0.65" },
      d: "M10.75 19q.95 0 1.6-.65t.65-1.6V13h3v-2h-4v3.875q-.275-.2-.587-.288t-.663-.087q-.95 0-1.6.65t-.65 1.6t.65 1.6t1.6.65M6 22q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h8l6 6v12q0 .825-.587 1.413T18 22zm7-13V4H6v16h12V9zM6 4v5zv16z"
    }
  ) });
}
function VideoPlayer({
  asset,
  thumbnailWidth = 250,
  children,
  hlsConfig,
  ...props
}) {
  const client = useClient(), { dialogState } = useDialogStateContext(), isAudio = assetIsAudio(asset), muxPlayer = React.useRef(null), [error, setError] = React.useState(), playbackId = React.useMemo(() => {
    try {
      return getPlaybackId(asset, ["public", "signed", "drm"]);
    } catch {
      setError(new TypeError("Asset has no playback ID"));
      return;
    }
  }, [asset]), muxPlaybackId2 = React.useMemo(() => {
    if (playbackId)
      return getPlaybackPolicyById(asset, playbackId);
  }, [asset, playbackId]), src = React.useMemo(() => {
    if (playbackId && muxPlaybackId2)
      return tryWithSuspend(
        () => getVideoSrc({ muxPlaybackId: muxPlaybackId2, client }),
        (e) => {
          setError(e);
        }
      );
  }, [muxPlaybackId2, playbackId, client]), poster = React.useMemo(() => tryWithSuspend(
    () => getPosterSrc({ asset, client, width: thumbnailWidth }),
    (e) => {
      setError(e);
    }
  ), [asset, client, thumbnailWidth]), signedToken = React.useMemo(() => {
    try {
      return new URL(src).searchParams.get("token");
    } catch {
      return;
    }
  }, [src]), drmToken = React.useMemo(() => {
    if (playbackId && muxPlaybackId2?.policy === "drm")
      return tryWithSuspend(
        () => generateJwt(client, playbackId, "d"),
        (e) => {
          setError(e);
        }
      );
  }, [client, muxPlaybackId2?.policy, playbackId]), tokens = React.useMemo(() => {
    try {
      const partialTokens = {
        playback: void 0,
        thumbnail: void 0,
        storyboard: void 0,
        drm: void 0
      };
      return signedToken && (partialTokens.playback = signedToken, partialTokens.thumbnail = signedToken, partialTokens.storyboard = signedToken), drmToken && (partialTokens.drm = drmToken), { ...partialTokens };
    } catch {
      return;
    }
  }, [signedToken, drmToken]), [width, height] = (asset?.data?.aspect_ratio ?? "16:9").split(":").map(Number), targetAspectRatio = props.forceAspectRatio || (Number.isNaN(width) ? 16 / 9 : width / height);
  let aspectRatio = Math.max(MIN_ASPECT_RATIO, targetAspectRatio);
  return isAudio && (aspectRatio = props.forceAspectRatio ? (
    // Make it wider when forcing aspect ratio to balance with videos' rendering height (audio players overflow a bit)
    props.forceAspectRatio * 1.2
  ) : AUDIO_ASPECT_RATIO), /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsxs(
      ui.Card,
      {
        tone: "transparent",
        style: {
          aspectRatio,
          position: "relative",
          ...isAudio && { display: "flex", alignItems: "flex-end" }
        },
        children: [
          src && poster && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            isAudio && /* @__PURE__ */ jsxRuntime.jsx(
              AudioIcon,
              {
                style: {
                  padding: "0.5em",
                  width: "2.2em",
                  height: "2.2em",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 1
                }
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsxs(React.Suspense, { fallback: null, children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                MuxPlayer__default.default,
                {
                  poster: isAudio ? void 0 : poster,
                  ref: muxPlayer,
                  ...props,
                  playsInline: !0,
                  playbackId,
                  tokens,
                  preload: "metadata",
                  crossOrigin: "anonymous",
                  metadata: {
                    player_name: "Sanity Admin Dashboard",
                    player_version: "2.15.0",
                    page_type: "Preview Player"
                  },
                  audio: isAudio,
                  _hlsConfig: hlsConfig,
                  style: {
                    ...!isAudio && { height: "100%" },
                    width: "100%",
                    display: "block",
                    objectFit: "contain",
                    ...isAudio && { alignSelf: "end" }
                  }
                }
              ),
              children
            ] })
          ] }),
          error ? /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              style: {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
              },
              children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { muted: !0, children: [
                /* @__PURE__ */ jsxRuntime.jsx(icons.ErrorOutlineIcon, { style: { marginRight: "0.15em" } }),
                typeof error == "object" && "message" in error && typeof error.message == "string" ? error.message : "Error loading video"
              ] })
            }
          ) : null,
          children
        ]
      }
    ),
    dialogState === "edit-thumbnail" && /* @__PURE__ */ jsxRuntime.jsx(EditThumbnailDialog, { asset, currentTime: muxPlayer?.current?.currentTime }),
    dialogState === "edit-captions" && /* @__PURE__ */ jsxRuntime.jsx(CaptionsDialog, { asset }),
    dialogState === "download-asset" && /* @__PURE__ */ jsxRuntime.jsx(DownloadAssetDialog, { asset })
  ] });
}
function assetIsAudio(asset) {
  return asset.data?.max_stored_resolution === "Audio only";
}
const getUnknownTypeFallback = (id, typeName) => ({
  title: /* @__PURE__ */ jsxRuntime.jsxs("em", { children: [
    "No schema found for type ",
    /* @__PURE__ */ jsxRuntime.jsx("code", { children: typeName })
  ] }),
  subtitle: /* @__PURE__ */ jsxRuntime.jsxs("em", { children: [
    "Document: ",
    /* @__PURE__ */ jsxRuntime.jsx("code", { children: id })
  ] }),
  media: () => /* @__PURE__ */ jsxRuntime.jsx(icons.WarningOutlineIcon, {})
});
function MissingSchemaType(props) {
  const { layout, value } = props;
  return /* @__PURE__ */ jsxRuntime.jsx(sanity.SanityDefaultPreview, { ...getUnknownTypeFallback(value._id, value._type), layout });
}
function TimeAgo({ time }) {
  const timeAgo = sanity.useTimeAgo(time);
  return /* @__PURE__ */ jsxRuntime.jsxs("span", { title: timeAgo, children: [
    timeAgo,
    " ago"
  ] });
}
function DraftStatus(props) {
  const { document: document2 } = props, updatedAt = document2 && "_updatedAt" in document2 && document2._updatedAt;
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.Tooltip,
    {
      animate: !0,
      portal: !0,
      content: /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { padding: 2, children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, children: document2 ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        "Edited ",
        updatedAt && /* @__PURE__ */ jsxRuntime.jsx(TimeAgo, { time: updatedAt })
      ] }) : /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: "No unpublished edits" }) }) }),
      children: /* @__PURE__ */ jsxRuntime.jsx(sanity.TextWithTone, { tone: "caution", dimmed: !document2, muted: !document2, size: 1, children: /* @__PURE__ */ jsxRuntime.jsx(icons.EditIcon, {}) })
    }
  );
}
function PublishedStatus(props) {
  const { document: document2 } = props, updatedAt = document2 && "_updatedAt" in document2 && document2._updatedAt;
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.Tooltip,
    {
      animate: !0,
      portal: !0,
      content: /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { padding: 2, children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, children: document2 ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
        "Published ",
        updatedAt && /* @__PURE__ */ jsxRuntime.jsx(TimeAgo, { time: updatedAt })
      ] }) : /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: "Not published" }) }) }),
      children: /* @__PURE__ */ jsxRuntime.jsx(sanity.TextWithTone, { tone: "positive", dimmed: !document2, muted: !document2, size: 1, children: /* @__PURE__ */ jsxRuntime.jsx(icons.PublishIcon, {}) })
    }
  );
}
function PaneItemPreview(props) {
  const { icon, layout, presence, schemaType, value } = props, title = sanity.isRecord(value.title) && React.isValidElement(value.title) || isString__default.default(value.title) || isNumber__default.default(value.title) ? value.title : null, observable = React.useMemo(
    () => sanity.getPreviewStateObservable(props.documentPreviewStore, schemaType, value._id),
    [props.documentPreviewStore, schemaType, value._id]
  ), { snapshot, original, isLoading } = reactRx.useObservable(observable, {
    isLoading: !0,
    snapshot: null,
    original: null
  }), status = isLoading ? null : /* @__PURE__ */ jsxRuntime.jsxs(ui.Inline, { space: 4, children: [
    presence && presence.length > 0 && /* @__PURE__ */ jsxRuntime.jsx(sanity.DocumentPreviewPresence, { presence }),
    /* @__PURE__ */ jsxRuntime.jsx(PublishedStatus, { document: original }),
    /* @__PURE__ */ jsxRuntime.jsx(DraftStatus, { document: snapshot })
  ] });
  return /* @__PURE__ */ jsxRuntime.jsx(
    sanity.SanityDefaultPreview,
    {
      ...sanity.getPreviewValueWithFallback({ snapshot, original, fallback: { title } }),
      isPlaceholder: isLoading,
      icon,
      layout,
      status
    }
  );
}
function getIconWithFallback(icon, schemaType, defaultIcon) {
  return icon === !1 ? !1 : icon || schemaType && schemaType.icon || defaultIcon || !1;
}
function DocumentPreviewLink(props) {
  return (linkProps) => /* @__PURE__ */ jsxRuntime.jsx(router.IntentLink, { intent: "edit", params: { id: props.documentPair.id }, children: linkProps.children });
}
function DocumentPreview(props) {
  const { schemaType, documentPair } = props, doc = documentPair?.draft || documentPair?.published, id = documentPair.id || "", documentPreviewStore = sanity.useDocumentPreviewStore(), schema = sanity.useSchema(), documentPresence = sanity.useDocumentPresence(id), hasSchemaType = !!(schemaType && schemaType.name && schema.get(schemaType.name)), PreviewComponent = React.useMemo(() => doc ? !schemaType || !hasSchemaType ? /* @__PURE__ */ jsxRuntime.jsx(MissingSchemaType, { value: doc }) : /* @__PURE__ */ jsxRuntime.jsx(
    PaneItemPreview,
    {
      documentPreviewStore,
      icon: getIconWithFallback(void 0, schemaType, icons.DocumentIcon),
      schemaType,
      layout: "default",
      value: doc,
      presence: documentPresence
    }
  ) : null, [hasSchemaType, schemaType, documentPresence, doc, documentPreviewStore]);
  return /* @__PURE__ */ jsxRuntime.jsx(
    sanity.PreviewCard,
    {
      __unstable_focusRing: !0,
      as: DocumentPreviewLink(props),
      "data-as": "a",
      "data-ui": "PaneItem",
      padding: 2,
      radius: 2,
      tone: "inherit",
      children: PreviewComponent
    }
  );
}
const Container = styledComponents.styled(ui.Box)`
  * {
    color: ${(props) => props.theme.sanity.color.base.fg};
  }
  a {
    text-decoration: none;
  }
  h2 {
    font-size: ${(props) => props.theme.sanity.fonts.text.sizes[1]};
  }
`, VideoReferences = (props) => {
  const schema = sanity.useSchema();
  if (!props.isLoaded)
    return /* @__PURE__ */ jsxRuntime.jsx(SpinnerBox, {});
  if (!props.references?.length)
    return /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { border: !0, radius: 3, padding: 3, children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 2, children: "No documents are using this video" }) });
  const documentPairs = sanity.collate(props.references || []);
  return /* @__PURE__ */ jsxRuntime.jsx(Container, { children: documentPairs?.map((documentPair) => {
    const schemaType = schema.get(documentPair.type);
    return /* @__PURE__ */ jsxRuntime.jsx(
      ui.Card,
      {
        marginBottom: 2,
        padding: 2,
        radius: 2,
        shadow: 1,
        style: { overflow: "hidden" },
        children: /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { children: /* @__PURE__ */ jsxRuntime.jsx(DocumentPreview, { documentPair, schemaType }) })
      },
      documentPair.id
    );
  }) });
};
function DeleteDialog({
  asset,
  references,
  referencesLoading,
  cancelDelete,
  succeededDeleting
}) {
  const client = useClient(), [state, setState] = React.useState("checkingReferences"), [deleteOnMux, setDeleteOnMux] = React.useState(!0), toast = ui.useToast();
  React.useEffect(() => {
    state !== "checkingReferences" || referencesLoading || setState(references?.length ? "cantDelete" : "confirm");
  }, [state, references, referencesLoading]);
  async function confirmDelete() {
    if (state !== "confirm") return;
    setState("processing_deletion");
    const worked = await deleteAsset({ client, asset, deleteOnMux });
    worked === !0 ? (toast.push({ title: "Successfully deleted video", status: "success" }), succeededDeleting()) : worked === "failed-mux" ? (toast.push({
      title: "Deleted video in Sanity",
      description: "But it wasn't deleted in Mux",
      status: "warning"
    }), succeededDeleting()) : (toast.push({ title: "Failed deleting video", status: "error" }), setState("error_deleting"));
  }
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.Dialog,
    {
      animate: !0,
      header: "Delete video",
      zOffset: DIALOGS_Z_INDEX,
      id: "deleting-video-details-dialog",
      onClose: cancelDelete,
      onClickOutside: cancelDelete,
      width: 1,
      position: "fixed",
      children: /* @__PURE__ */ jsxRuntime.jsx(
        ui.Card,
        {
          padding: 3,
          style: {
            minHeight: "150px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          },
          children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 3, children: [
            state === "checkingReferences" && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
              /* @__PURE__ */ jsxRuntime.jsx(ui.Heading, { size: 2, children: "Checking if video can be deleted" }),
              /* @__PURE__ */ jsxRuntime.jsx(SpinnerBox, {})
            ] }),
            state === "cantDelete" && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
              /* @__PURE__ */ jsxRuntime.jsx(ui.Heading, { size: 2, children: "Video can't be deleted" }),
              /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: 2, style: { marginBottom: "2rem" }, children: [
                "There are ",
                references?.length,
                " document",
                references && references.length > 0 && "s",
                " ",
                "pointing to this video. Remove their references to this file or delete them before proceeding."
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx(VideoReferences, { references, isLoaded: !referencesLoading })
            ] }),
            state === "confirm" && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
              /* @__PURE__ */ jsxRuntime.jsx(ui.Heading, { size: 2, children: "Are you sure you want to delete this video?" }),
              /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 2, children: "This action is irreversible" }),
              /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 4, marginY: 4, children: [
                /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", as: "label", children: [
                  /* @__PURE__ */ jsxRuntime.jsx(
                    ui.Checkbox,
                    {
                      checked: deleteOnMux,
                      onChange: () => setDeleteOnMux((prev) => !prev)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { style: { margin: "0 10px" }, children: "Delete asset on Mux" })
                ] }),
                /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", as: "label", children: [
                  /* @__PURE__ */ jsxRuntime.jsx(ui.Checkbox, { disabled: !0, checked: !0 }),
                  /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { style: { margin: "0 10px" }, children: "Delete video from dataset" })
                ] }),
                /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { children: /* @__PURE__ */ jsxRuntime.jsx(
                  ui.Button,
                  {
                    icon: icons.TrashIcon,
                    fontSize: 2,
                    padding: 3,
                    text: "Delete video",
                    tone: "critical",
                    onClick: confirmDelete,
                    disabled: ["processing_deletion", "checkingReferences", "cantDelete"].some(
                      (s) => s === state
                    )
                  }
                ) })
              ] })
            ] }),
            state === "processing_deletion" && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
              /* @__PURE__ */ jsxRuntime.jsx(ui.Heading, { size: 2, children: "Deleting video..." }),
              /* @__PURE__ */ jsxRuntime.jsx(SpinnerBox, {})
            ] }),
            state === "error_deleting" && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
              /* @__PURE__ */ jsxRuntime.jsx(ui.Heading, { size: 2, children: "Something went wrong!" }),
              /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 2, children: "Try deleting the video again by clicking the button below" })
            ] })
          ] })
        }
      )
    }
  );
}
const useDocReferences = sanity.createHookFromObservableFactory(({ documentStore, id }) => documentStore.listenQuery(
  /* groq */
  "*[references($id)]{_id, _type, _rev, _updatedAt, _createdAt}",
  { id },
  {
    apiVersion: SANITY_API_VERSION
  }
));
function getVideoMetadata(doc) {
  const id = doc.assetId || doc._id || "", date = doc.data?.created_at ? new Date(Number(doc.data.created_at) * 1e3) : new Date(doc._createdAt || doc._updatedAt || Date.now());
  return {
    title: doc.filename || id.slice(0, 12),
    id,
    playbackId: doc.playbackId,
    createdAt: date,
    duration: doc.data?.duration ? formatSeconds(doc.data?.duration) : void 0,
    playback_ids: doc.data?.playback_ids,
    aspect_ratio: doc.data?.aspect_ratio,
    max_stored_resolution: doc.data?.max_stored_resolution,
    max_stored_frame_rate: doc.data?.max_stored_frame_rate,
    text_tracks: doc.data?.tracks?.filter((track) => track.type === "text") || []
  };
}
function useVideoDetails(props) {
  const documentStore = sanity.useDocumentStore(), toast = ui.useToast(), client = useClient(), [references, referencesLoading] = useDocReferences(
    React.useMemo(() => ({ documentStore, id: props.asset._id }), [documentStore, props.asset._id])
  ), [originalAsset, setOriginalAsset] = React.useState(() => props.asset), [filename, setFilename] = React.useState(props.asset.filename), modified = filename !== originalAsset.filename, displayInfo = getVideoMetadata({ ...props.asset, filename }), [state, setState] = React.useState("idle"), { resyncAsset, isResyncing } = useResyncAsset({ showToast: !0 });
  async function handleResync() {
    state === "idle" && (setState("resyncing"), await resyncAsset(props.asset), setState("idle"));
  }
  function handleClose() {
    if (state === "idle") {
      if (modified) {
        setState("closing");
        return;
      }
      props.closeDialog();
    }
  }
  function confirmClose(shouldClose) {
    state === "closing" && (shouldClose && props.closeDialog(), setState("idle"));
  }
  async function saveChanges() {
    if (state === "idle") {
      setState("saving");
      try {
        await client.patch(props.asset._id).set({ filename }).commit(), setOriginalAsset((prev) => ({ ...prev, filename })), toast.push({
          title: "Video title updated",
          description: `New title: ${filename}`,
          status: "success"
        }), props.closeDialog();
      } catch (error) {
        toast.push({
          title: "Failed updating file name",
          status: "error",
          description: typeof error == "string" ? error : "Please try again"
        }), setFilename(originalAsset.filename);
      }
      setState("idle");
    }
  }
  return {
    references,
    referencesLoading,
    modified,
    filename,
    setFilename,
    displayInfo,
    state,
    setState,
    handleClose,
    confirmClose,
    saveChanges,
    handleResync,
    isResyncing
  };
}
const AssetInput = (props) => /* @__PURE__ */ jsxRuntime.jsx(FormField$1, { title: props.label, description: props.description, inputId: props.label, children: /* @__PURE__ */ jsxRuntime.jsx(
  ui.TextInput,
  {
    id: props.label,
    value: props.value,
    placeholder: props.placeholder,
    onInput: props.onInput,
    disabled: props.disabled
  }
) }), VideoDetails = (props) => {
  const [tab, setTab] = React.useState("details"), {
    displayInfo,
    filename,
    modified,
    references,
    referencesLoading,
    setFilename,
    state,
    setState,
    handleClose,
    confirmClose,
    saveChanges,
    handleResync,
    isResyncing
  } = useVideoDetails(props), isSaving = state === "saving", [containerHeight, setContainerHeight] = React.useState(null), contentsRef = React__default.default.useRef(null);
  return React.useEffect(() => {
    !contentsRef.current || !("getBoundingClientRect" in contentsRef.current) || setContainerHeight(contentsRef.current.getBoundingClientRect().height);
  }, []), /* @__PURE__ */ jsxRuntime.jsxs(
    ui.Dialog,
    {
      animate: !0,
      header: displayInfo.title,
      zOffset: DIALOGS_Z_INDEX,
      id: "video-details-dialog",
      onClose: handleClose,
      onClickOutside: handleClose,
      width: 2,
      position: "fixed",
      footer: /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { padding: 3, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { justify: "space-between", align: "center", children: [
        /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { gap: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            ui.Button,
            {
              icon: icons.TrashIcon,
              fontSize: 2,
              padding: 3,
              mode: "bleed",
              text: "Delete",
              tone: "critical",
              onClick: () => setState("deleting"),
              disabled: isSaving || isResyncing
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            ui.Button,
            {
              icon: icons.SyncIcon,
              fontSize: 2,
              padding: 3,
              mode: "bleed",
              text: "Resync",
              tone: "primary",
              onClick: handleResync,
              disabled: isSaving || isResyncing,
              iconRight: isResyncing && ui.Spinner
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { gap: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            ui.Button,
            {
              icon: icons.DownloadIcon,
              fontSize: 2,
              padding: 3,
              mode: "bleed",
              text: "Download",
              tone: "default",
              onClick: () => setState("downloading"),
              disabled: isSaving
            }
          ),
          modified && /* @__PURE__ */ jsxRuntime.jsx(
            ui.Button,
            {
              icon: icons.CheckmarkIcon,
              fontSize: 2,
              padding: 3,
              mode: "ghost",
              text: "Save and close",
              tone: "positive",
              onClick: saveChanges,
              iconRight: isSaving && ui.Spinner,
              disabled: isSaving || isResyncing
            }
          )
        ] })
      ] }) }),
      children: [
        state === "deleting" && /* @__PURE__ */ jsxRuntime.jsx(
          DeleteDialog,
          {
            asset: props.asset,
            cancelDelete: () => setState("idle"),
            referencesLoading,
            references,
            succeededDeleting: () => {
              props.closeDialog();
            }
          }
        ),
        state === "downloading" && /* @__PURE__ */ jsxRuntime.jsx(
          DownloadAssetDialog,
          {
            asset: props.asset,
            onClose: () => setState("idle"),
            absolute: !0
          }
        ),
        state === "closing" && /* @__PURE__ */ jsxRuntime.jsx(
          ui.Dialog,
          {
            animate: !0,
            header: "You have unsaved changes",
            zOffset: DIALOGS_Z_INDEX,
            id: "closing-video-details-dialog",
            onClose: () => confirmClose(!1),
            onClickOutside: () => confirmClose(!1),
            width: 1,
            position: "fixed",
            footer: /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { padding: 3, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { justify: "space-between", align: "center", children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                ui.Button,
                {
                  icon: icons.ErrorOutlineIcon,
                  fontSize: 2,
                  padding: 3,
                  text: "Discard changes",
                  tone: "critical",
                  onClick: () => confirmClose(!0)
                }
              ),
              modified && /* @__PURE__ */ jsxRuntime.jsx(
                ui.Button,
                {
                  icon: icons.RevertIcon,
                  fontSize: 2,
                  padding: 3,
                  mode: "ghost",
                  text: "Keep editing",
                  tone: "primary",
                  onClick: () => confirmClose(!1)
                }
              )
            ] }) }),
            children: /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { padding: 5, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { style: { textAlign: "center" }, space: 3, children: [
              /* @__PURE__ */ jsxRuntime.jsx(ui.Heading, { size: 2, children: "Unsaved changes will be lost" }),
              /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 2, children: "Are you sure you want to discard them?" })
            ] }) })
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Card,
          {
            padding: 4,
            sizing: "border",
            style: {
              containerType: "inline-size"
            },
            children: /* @__PURE__ */ jsxRuntime.jsxs(
              ui.Flex,
              {
                sizing: "border",
                gap: 4,
                direction: ["column", "column", "row"],
                align: "flex-start",
                ref: contentsRef,
                style: typeof containerHeight == "number" ? {
                  minHeight: containerHeight
                } : void 0,
                children: [
                  /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 4, flex: 1, sizing: "border", children: [
                    /* @__PURE__ */ jsxRuntime.jsx(VideoPlayer, { asset: props.asset, autoPlay: props.asset.autoPlay || !1 }),
                    tab === "details" && /* @__PURE__ */ jsxRuntime.jsx(
                      TextTracksManager,
                      {
                        asset: props.asset,
                        iconOnly: !0,
                        collapseTracks: !0,
                        tracks: displayInfo?.text_tracks || props.asset.data?.tracks?.filter(
                          (track) => track.type === "text"
                        ) || []
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 4, flex: 1, sizing: "border", children: [
                    /* @__PURE__ */ jsxRuntime.jsxs(ui.TabList, { space: 2, children: [
                      /* @__PURE__ */ jsxRuntime.jsx(
                        ui.Tab,
                        {
                          "aria-controls": "details-panel",
                          icon: icons.EditIcon,
                          id: "details-tab",
                          label: "Details",
                          onClick: () => setTab("details"),
                          selected: tab === "details"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntime.jsx(
                        ui.Tab,
                        {
                          "aria-controls": "references-panel",
                          icon: icons.SearchIcon,
                          id: "references-tab",
                          label: `Used by ${references ? `(${references.length})` : ""}`,
                          onClick: () => setTab("references"),
                          selected: tab === "references"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntime.jsx(
                      ui.TabPanel,
                      {
                        "aria-labelledby": "details-tab",
                        id: "details-panel",
                        hidden: tab !== "details",
                        style: { wordBreak: "break-word" },
                        children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 4, children: [
                          /* @__PURE__ */ jsxRuntime.jsx(
                            AssetInput,
                            {
                              label: "Video title or file name",
                              description: "Not visible to users. Useful for finding videos later.",
                              value: filename || "",
                              onInput: (e) => setFilename(e.currentTarget.value),
                              disabled: state !== "idle"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 3, children: [
                            displayInfo?.duration && /* @__PURE__ */ jsxRuntime.jsx(
                              IconInfo,
                              {
                                text: `Duration: ${displayInfo.duration}`,
                                icon: icons.ClockIcon,
                                size: 2
                              }
                            ),
                            displayInfo?.max_stored_resolution && /* @__PURE__ */ jsxRuntime.jsx(
                              IconInfo,
                              {
                                text: `Max Resolution: ${displayInfo.max_stored_resolution}`,
                                icon: ResolutionIcon,
                                size: 2
                              }
                            ),
                            displayInfo?.max_stored_frame_rate && /* @__PURE__ */ jsxRuntime.jsx(
                              IconInfo,
                              {
                                text: `Frame rate: ${displayInfo.max_stored_frame_rate}`,
                                icon: StopWatchIcon,
                                size: 2
                              }
                            ),
                            displayInfo?.aspect_ratio && /* @__PURE__ */ jsxRuntime.jsx(
                              IconInfo,
                              {
                                text: `Aspect Ratio: ${displayInfo.aspect_ratio}`,
                                icon: icons.CropIcon,
                                size: 2
                              }
                            ),
                            /* @__PURE__ */ jsxRuntime.jsx(
                              IconInfo,
                              {
                                text: `Uploaded on: ${displayInfo.createdAt.toLocaleDateString("en", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: !0
                                })}`,
                                icon: icons.CalendarIcon,
                                size: 2
                              }
                            ),
                            /* @__PURE__ */ jsxRuntime.jsx(IconInfo, { text: `Mux ID: 
${displayInfo.id}`, icon: icons.TagIcon, size: 2 }),
                            /* @__PURE__ */ jsxRuntime.jsx(PlaybackIds, { playback_ids: displayInfo.playback_ids })
                          ] })
                        ] })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntime.jsx(
                      ui.TabPanel,
                      {
                        "aria-labelledby": "references-tab",
                        id: "references-panel",
                        hidden: tab !== "references",
                        children: /* @__PURE__ */ jsxRuntime.jsx(VideoReferences, { references, isLoaded: !referencesLoading })
                      }
                    )
                  ] })
                ]
              }
            )
          }
        )
      ]
    }
  );
}, PlaybackIds = ({ playback_ids }) => playback_ids ? playback_ids.map((entry) => /* @__PURE__ */ jsxRuntime.jsx(
  IconInfo,
  {
    text: `Playback ID [${policyToText(entry.policy)}]: ${entry.id}`,
    icon: icons.TagIcon,
    size: 2
  },
  entry.id
)) : /* @__PURE__ */ jsxRuntime.jsx(IconInfo, { text: "No Playback ID", icon: icons.TagIcon, size: 2 }), policyToText = (policy) => {
  switch (policy) {
    case "drm":
      return "DRM";
    case "signed":
      return "Signed";
    case "public":
      return "Public";
    default:
      return policy;
  }
}, VideoMetadata = (props) => {
  if (!props.asset)
    return null;
  const displayInfo = getVideoMetadata(props.asset);
  return /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
    displayInfo.title && /* @__PURE__ */ jsxRuntime.jsx(
      ui.Text,
      {
        size: 1,
        weight: "semibold",
        style: {
          wordWrap: "break-word"
        },
        children: displayInfo.title
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsxs(ui.Inline, { space: 3, children: [
      displayInfo?.duration && /* @__PURE__ */ jsxRuntime.jsx(IconInfo, { text: displayInfo.duration, icon: icons.ClockIcon, size: 1, muted: !0 }),
      /* @__PURE__ */ jsxRuntime.jsx(
        IconInfo,
        {
          text: displayInfo.createdAt.toISOString().split("T")[0],
          icon: icons.CalendarIcon,
          size: 1,
          muted: !0
        }
      ),
      displayInfo.title != displayInfo.id.slice(0, 12) && /* @__PURE__ */ jsxRuntime.jsx(IconInfo, { text: displayInfo.id.slice(0, 12), icon: icons.TagIcon, size: 1, muted: !0 })
    ] })
  ] });
}, PlayButton = styledComponents.styled.button`
  display: block;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 0.1875rem;
  position: relative;
  cursor: pointer;

  &::after {
    content: '';
    background: var(--card-fg-color);
    opacity: 0;
    display: block;
    position: absolute;
    inset: 0;
    z-index: 10;
    transition: 0.15s ease-out;
    border-radius: inherit;
  }

  > div[data-play] {
    z-index: 11;
    opacity: 0;
    transition: 0.15s 0.05s ease-out;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: var(--card-fg-color);
    background: var(--card-bg-color);
    width: auto;
    height: 30%;
    aspect-ratio: 1;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    > svg {
      display: block;
      width: 70%;
      height: auto;
      // Visual balance to center-align the icon
      transform: translateX(5%);
    }
  }

  &:hover,
  &:focus {
    &::after {
      opacity: 0.3;
    }
    > div[data-play] {
      opacity: 1;
    }
  }
`;
function VideoInBrowser({
  onSelect,
  onEdit,
  asset
}) {
  const [renderVideo, setRenderVideo] = React.useState(!1), select = React__default.default.useCallback(() => onSelect?.(asset), [onSelect, asset]), edit = React__default.default.useCallback(() => onEdit?.(asset), [onEdit, asset]), { hasShownWarning } = useDrmPlaybackWarningContext();
  if (!asset)
    return null;
  const playbackPolicy = getPlaybackPolicy(asset), onClickPlay = () => {
    playbackPolicy?.policy === "drm" && !hasShownWarning ? setRenderVideo("pre-render-warn") : setRenderVideo("render-video");
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(
    ui.Card,
    {
      border: !0,
      padding: 2,
      sizing: "border",
      radius: 2,
      style: {
        position: "relative"
      },
      children: [
        playbackPolicy?.policy === "signed" && /* @__PURE__ */ jsxRuntime.jsx(
          ui.Tooltip,
          {
            animate: !0,
            content: /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { padding: 2, radius: 2, children: /* @__PURE__ */ jsxRuntime.jsx(IconInfo, { icon: icons.LockIcon, text: "Signed playback policy", size: 2 }) }),
            placement: "right",
            fallbackPlacements: ["top", "bottom"],
            portal: !0,
            children: /* @__PURE__ */ jsxRuntime.jsx(
              ui.Card,
              {
                tone: "caution",
                style: {
                  borderRadius: "100%",
                  position: "absolute",
                  left: "1em",
                  top: "1em",
                  zIndex: 11
                },
                padding: 2,
                border: !0,
                children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { muted: !0, size: 1, children: /* @__PURE__ */ jsxRuntime.jsx(icons.LockIcon, {}) })
              }
            )
          }
        ),
        playbackPolicy?.policy === "drm" && /* @__PURE__ */ jsxRuntime.jsx(
          ui.Tooltip,
          {
            animate: !0,
            content: /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { padding: 2, radius: 2, children: /* @__PURE__ */ jsxRuntime.jsx(IconInfo, { icon: icons.LockIcon, text: "DRM playback policy", size: 2 }) }),
            placement: "right",
            fallbackPlacements: ["top", "bottom"],
            portal: !0,
            children: /* @__PURE__ */ jsxRuntime.jsx(
              ui.Card,
              {
                tone: "caution",
                style: {
                  borderRadius: "0.25rem",
                  position: "absolute",
                  left: "1em",
                  top: "1em",
                  zIndex: 11
                },
                padding: 2,
                border: !0,
                children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { muted: !0, size: 1, weight: "semibold", style: { color: "var(--card-icon-color)" }, children: "DRM" })
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs(
          ui.Stack,
          {
            space: 3,
            height: "fill",
            style: {
              gridTemplateRows: "min-content min-content 1fr"
            },
            children: [
              renderVideo === "pre-render-warn" && /* @__PURE__ */ jsxRuntime.jsx(
                DRMWarningDialog,
                {
                  onClose: () => {
                    setRenderVideo("render-video");
                  }
                }
              ),
              renderVideo === "render-video" ? /* @__PURE__ */ jsxRuntime.jsx(VideoPlayer, { asset, autoPlay: !0, forceAspectRatio: THUMBNAIL_ASPECT_RATIO }) : /* @__PURE__ */ jsxRuntime.jsxs(PlayButton, { onClick: onClickPlay, children: [
                /* @__PURE__ */ jsxRuntime.jsx("div", { "data-play": !0, children: /* @__PURE__ */ jsxRuntime.jsx(icons.PlayIcon, {}) }),
                assetIsAudio(asset) ? /* @__PURE__ */ jsxRuntime.jsx(
                  "div",
                  {
                    style: {
                      aspectRatio: THUMBNAIL_ASPECT_RATIO,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    },
                    children: /* @__PURE__ */ jsxRuntime.jsx(AudioIcon, { width: "3em", height: "3em" })
                  }
                ) : /* @__PURE__ */ jsxRuntime.jsx(VideoThumbnail, { asset })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx(VideoMetadata, { asset }),
              /* @__PURE__ */ jsxRuntime.jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    width: "100%",
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                    gap: ".35rem"
                  },
                  children: [
                    onSelect && /* @__PURE__ */ jsxRuntime.jsx(
                      ui.Button,
                      {
                        icon: icons.CheckmarkIcon,
                        fontSize: 2,
                        padding: 2,
                        mode: "ghost",
                        text: "Select",
                        style: { flex: 1 },
                        tone: "positive",
                        onClick: select
                      }
                    ),
                    /* @__PURE__ */ jsxRuntime.jsx(
                      ui.Button,
                      {
                        icon: icons.EditIcon,
                        fontSize: 2,
                        padding: 2,
                        mode: "ghost",
                        text: "Details",
                        style: { flex: 1 },
                        onClick: edit
                      }
                    )
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function VideosBrowser({ onSelect, config }) {
  const { assets, isLoading, searchQuery, setSearchQuery, setSort, sort } = useAssets(), [page, setPage] = React.useState(0), pageLimit = 20, pageTotal = Math.floor(assets.length / pageLimit) + 1, [editedAsset, setEditedAsset] = React.useState(null), freshEditedAsset = React.useMemo(
    () => assets.find((a2) => a2._id === editedAsset?._id) || editedAsset,
    [editedAsset, assets]
  ), pageStart = page * pageLimit, pageEnd = pageStart + pageLimit;
  return /* @__PURE__ */ jsxRuntime.jsxs(DrmPlaybackWarningContextProvider, { config, children: [
    /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { padding: 4, space: 4, style: { minHeight: "50vh" }, children: [
      /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { justify: "space-between", align: "center", children: [
        /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", gap: 3, children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            ui.TextInput,
            {
              value: searchQuery,
              icon: icons.SearchIcon,
              onInput: (e) => setSearchQuery(e.currentTarget.value),
              placeholder: "Search videos"
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(SelectSortOptions, { setSort, sort }),
          /* @__PURE__ */ jsxRuntime.jsx(PageSelector, { page, setPage, total: pageTotal })
        ] }),
        (onSelect ? "input" : "tool") == "tool" && /* @__PURE__ */ jsxRuntime.jsxs(ui.Inline, { space: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsx(ImportVideosFromMux, {}),
          /* @__PURE__ */ jsxRuntime.jsx(ResyncMetadata, {}),
          /* @__PURE__ */ jsxRuntime.jsx(ConfigureApi, {})
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 3, children: [
        assets?.length > 0 && /* @__PURE__ */ jsxRuntime.jsxs(ui.Label, { muted: !0, children: [
          assets.length,
          " video",
          assets.length > 1 ? "s" : null,
          " ",
          searchQuery ? `matching "${searchQuery}"` : "found"
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Grid,
          {
            gap: 2,
            style: {
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))"
            },
            children: assets.slice(pageStart, pageEnd).map((asset) => /* @__PURE__ */ jsxRuntime.jsx(
              VideoInBrowser,
              {
                asset,
                onEdit: setEditedAsset,
                onSelect
              },
              asset._id
            ))
          }
        )
      ] }),
      isLoading && /* @__PURE__ */ jsxRuntime.jsx(SpinnerBox, {}),
      !isLoading && assets.length === 0 && /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { marginY: 4, paddingX: 4, paddingY: 6, border: !0, radius: 2, tone: "transparent", children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { align: "center", muted: !0, size: 3, children: searchQuery ? `No videos found for "${searchQuery}"` : "No videos in this dataset" }) })
    ] }),
    freshEditedAsset && /* @__PURE__ */ jsxRuntime.jsx(VideoDetails, { closeDialog: () => setEditedAsset(null), asset: freshEditedAsset })
  ] });
}
const StudioTool = (config) => /* @__PURE__ */ jsxRuntime.jsx(VideosBrowser, { config }), DEFAULT_TOOL_CONFIG = {
  icon: ToolIcon,
  title: "Videos"
};
function createStudioTool(config) {
  const toolConfig = typeof config.tool == "object" ? config.tool : DEFAULT_TOOL_CONFIG;
  return {
    name: "mux",
    icon: toolConfig.icon || DEFAULT_TOOL_CONFIG.icon,
    title: toolConfig.title || DEFAULT_TOOL_CONFIG.title,
    component: (props) => /* @__PURE__ */ jsxRuntime.jsx(StudioTool, { ...config, ...props })
  };
}
const useAccessControl = (config) => {
  const user = sanity.useCurrentUser();
  return { hasConfigAccess: !config?.allowedRolesForConfiguration?.length || user?.roles?.some((role) => config.allowedRolesForConfiguration.includes(role.name)) };
}, path = ["assetId", "data", "playbackId", "status", "thumbTime", "filename"], useAssetDocumentValues = (asset) => sanity.useDocumentValues(
  sanity.isReference(asset) ? asset._ref : "",
  path
), useMuxPolling = (asset) => {
  const client = useClient(), projectId = sanity.useProjectId(), dataset = sanity.useDataset(), isPreparingStaticRenditions = React.useMemo(() => {
    if (asset?.data?.static_renditions?.status && asset?.data?.static_renditions?.status !== "disabled")
      return !1;
    const files = asset?.data?.static_renditions?.files;
    return !files || files.length === 0 ? !1 : files.some((file) => file.status === "preparing");
  }, [asset?.data?.static_renditions?.status, asset?.data?.static_renditions?.files]), shouldFetch = React.useMemo(
    () => !!asset?.assetId && (asset?.status === "preparing" || isPreparingStaticRenditions),
    [asset?.assetId, asset?.status, isPreparingStaticRenditions]
  );
  return useSWR__default.default(
    shouldFetch ? `/${projectId}/addons/mux/assets/${dataset}/data/${asset?.assetId}` : null,
    async () => {
      const { data } = await client.request({
        url: `/addons/mux/assets/${dataset}/data/${asset.assetId}`,
        withCredentials: !0,
        method: "GET"
      });
      client.patch(asset._id).set({ status: data.status, data }).commit({ returnDocuments: !1 });
    },
    { refreshInterval: 2e3, refreshWhenHidden: !0, dedupingInterval: 1e3 }
  );
};
var c = (function(r) {
  var t, e;
  function n(t2) {
    var e2;
    return (e2 = r.call(this, t2) || this).state = { hasError: !1, error: null }, e2;
  }
  e = r, (t = n).prototype = Object.create(e.prototype), t.prototype.constructor = t, t.__proto__ = e, n.getDerivedStateFromError = function(r2) {
    return { hasError: !0, error: r2 };
  };
  var o = n.prototype;
  return o.componentDidCatch = function(r2, t2) {
    return this.props.onDidCatch(r2, t2);
  }, o.render = function() {
    var r2 = this.state, t2 = this.props, e2 = t2.render, n2 = t2.children, o2 = t2.renderError;
    return r2.hasError ? o2 ? o2({ error: r2.error }) : null : e2 ? e2() : n2 || null;
  }, n;
})(React.PureComponent), u = function(r, t) {
  switch (t.type) {
    case "catch":
      return { didCatch: !0, error: t.error };
    case "reset":
      return { didCatch: !1, error: null };
    default:
      return r;
  }
};
function a(t) {
  var a2 = React.useReducer(u, { didCatch: !1, error: null }), i = a2[0], d = a2[1], h = React.useRef(null);
  function l() {
    return e = function(r, e2) {
      d({ type: "catch", error: r }), t && t.onDidCatch && t.onDidCatch(r, e2);
    }, function(t2) {
      return React__default.default.createElement(c, { onDidCatch: e, children: t2.children, render: t2.render, renderError: t2.renderError });
    };
    var e;
  }
  var p, s = React.useCallback(function() {
    h.current = l(), d({ type: "reset" });
  }, []);
  return { ErrorBoundary: (p = h.current, p !== null ? p : (h.current = l(), h.current)), didCatch: i.didCatch, error: i.error, reset: s };
}
function ErrorBoundaryCard(props) {
  const { children, schemaType } = props, { push: pushToast } = ui.useToast(), errorRef = React.useRef(null), { ErrorBoundary, didCatch, error, reset } = a({
    onDidCatch: (err, errorInfo) => {
      console.group(err.toString()), console.groupCollapsed("console.error"), console.error(err), console.groupEnd(), err.stack && (console.groupCollapsed("error.stack"), console.log(err.stack), console.groupEnd()), errorInfo?.componentStack && (console.groupCollapsed("errorInfo.componentStack"), console.log(errorInfo.componentStack), console.groupEnd()), console.groupEnd(), pushToast({
        status: "error",
        title: "Plugin crashed",
        description: /* @__PURE__ */ jsxRuntime.jsx(ui.Flex, { align: "center", children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Inline, { space: 1, children: [
          "An error happened while rendering",
          /* @__PURE__ */ jsxRuntime.jsx(
            ui.Button,
            {
              padding: 1,
              fontSize: 1,
              style: { transform: "translateY(1px)" },
              mode: "ghost",
              text: schemaType.title,
              onClick: () => {
                errorRef.current && scrollIntoView__default.default(errorRef.current, {
                  behavior: "smooth",
                  scrollMode: "if-needed",
                  block: "center"
                });
              }
            }
          )
        ] }) })
      });
    }
  }), handleRetry = React.useCallback(() => {
    suspendReact.clear([name]), reset();
  }, [reset]);
  return didCatch ? /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { ref: errorRef, paddingX: [2, 3, 4, 4], height: "fill", shadow: 1, overflow: "auto", children: /* @__PURE__ */ jsxRuntime.jsx(ui.Flex, { justify: "flex-start", align: "center", height: "fill", children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Grid, { columns: 1, gap: [2, 3, 4, 4], children: [
    /* @__PURE__ */ jsxRuntime.jsxs(ui.Heading, { as: "h1", children: [
      "The ",
      /* @__PURE__ */ jsxRuntime.jsx("code", { children: name }),
      " plugin crashed"
    ] }),
    error?.message && /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { padding: 3, tone: "critical", shadow: 1, radius: 2, children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { children: error.message }) }),
    /* @__PURE__ */ jsxRuntime.jsx(ui.Inline, { children: /* @__PURE__ */ jsxRuntime.jsx(ui.Button, { onClick: handleRetry, text: "Retry" }) })
  ] }) }) }) : /* @__PURE__ */ jsxRuntime.jsx(ErrorBoundary, { children });
}
var ErrorBoundaryCard$1 = React.memo(ErrorBoundaryCard);
const InputFallback = () => /* @__PURE__ */ jsxRuntime.jsx("div", { style: { padding: 1 }, children: /* @__PURE__ */ jsxRuntime.jsx(
  ui.Card,
  {
    shadow: 1,
    sizing: "border",
    style: { aspectRatio: "16/9", width: "100%", borderRadius: "1px" },
    children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", direction: "column", height: "fill", justify: "center", children: [
      /* @__PURE__ */ jsxRuntime.jsx(ui.Spinner, { muted: !0 }),
      /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { marginTop: 3, children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { align: "center", muted: !0, size: 1, children: "Loading\u2026" }) })
    ] })
  }
) });
function Onboard(props) {
  const { setDialogState } = props, handleOpen = React.useCallback(() => setDialogState("secrets"), [setDialogState]), { hasConfigAccess } = useAccessControl(props.config);
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: /* @__PURE__ */ jsxRuntime.jsx("div", { style: { padding: 2 }, children: /* @__PURE__ */ jsxRuntime.jsx(
    ui.Card,
    {
      display: "flex",
      sizing: "border",
      style: {
        aspectRatio: "16/9",
        width: "100%",
        boxShadow: "var(--card-bg-color) 0 0 0 2px"
      },
      paddingX: [2, 3, 4, 4],
      radius: 1,
      tone: "transparent",
      children: /* @__PURE__ */ jsxRuntime.jsx(ui.Flex, { justify: "flex-start", align: "center", children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Grid, { columns: 1, gap: [2, 3, 4, 4], children: [
        /* @__PURE__ */ jsxRuntime.jsx(ui.Inline, { paddingY: 1, children: /* @__PURE__ */ jsxRuntime.jsx("div", { style: { height: "32px" }, children: /* @__PURE__ */ jsxRuntime.jsx(MuxLogo, {}) }) }),
        /* @__PURE__ */ jsxRuntime.jsx(ui.Inline, { paddingY: 1, children: /* @__PURE__ */ jsxRuntime.jsx(ui.Heading, { size: [0, 1, 2, 2], children: "Upload and preview videos directly from your studio." }) }),
        /* @__PURE__ */ jsxRuntime.jsx(ui.Inline, { paddingY: 1, children: hasConfigAccess ? /* @__PURE__ */ jsxRuntime.jsx(ui.Button, { mode: "ghost", icon: icons.PlugIcon, text: "Configure API", onClick: handleOpen }) : /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { padding: [3, 3, 3], radius: 2, shadow: 1, tone: "critical", children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { children: "You do not have access to configure the Mux API. Please contact your administrator." }) }) })
      ] }) })
    }
  ) }) });
}
function createUpChunkObservable(uuid2, uploadUrl2, source) {
  return new rxjs.Observable((subscriber) => {
    const upchunk$1 = upchunk.UpChunk.createUpload({
      endpoint: uploadUrl2,
      file: source,
      dynamicChunkSize: !0
      // changes the chunk size based on network speeds
    }), successHandler = () => {
      subscriber.next({
        type: "success",
        id: uuid2
      }), subscriber.complete();
    }, errorHandler = (data) => subscriber.error(new Error(data.detail.message)), progressHandler = (data) => subscriber.next({ type: "progress", percent: data.detail }), offlineHandler = () => {
      upchunk$1.pause(), subscriber.next({
        type: "pause",
        id: uuid2
      });
    }, onlineHandler = () => {
      upchunk$1.resume(), subscriber.next({
        type: "resume",
        id: uuid2
      });
    };
    return upchunk$1.on("success", successHandler), upchunk$1.on("error", errorHandler), upchunk$1.on("progress", progressHandler), upchunk$1.on("offline", offlineHandler), upchunk$1.on("online", onlineHandler), () => upchunk$1.abort();
  });
}
function formatDriveShareLink(url) {
  const formatExportLink = (id) => `https://drive.google.com/uc?export=download&id=${id}`;
  try {
    const trimmed = url.trim(), parsed = new URL(trimmed);
    if (parsed.hostname !== "drive.google.com")
      throw new Error("URL is not from Google Drive.");
    const id = parsed.searchParams.get("id") || "";
    if (id.length)
      return formatExportLink(id);
    const path2 = parsed.pathname.split("/") || [];
    if (path2.includes("file") && path2.includes("d")) {
      const index = path2.findIndex((value) => value === "d") + 1, id2 = path2.at(index) || "";
      return formatExportLink(id2);
    }
    if (path2.includes("folders")) {
      const index = path2.findIndex((value) => value === "folders") + 1, id2 = path2.at(index) || "";
      return formatExportLink(id2);
    }
    throw new Error("URL was not recognized.");
  } catch {
    return url;
  }
}
function cancelUpload(client, uuid2) {
  return client.observable.request({
    url: `/addons/mux/uploads/${client.config().dataset}/${uuid2}`,
    withCredentials: !0,
    method: "DELETE"
  });
}
function uploadUrl({
  url,
  settings,
  client,
  assetName
}) {
  return testUrl(url).pipe(
    operators.switchMap((validUrl) => rxjs.concat(
      rxjs.of({ type: "url", url: validUrl }),
      testSecretsObservable(client).pipe(
        operators.switchMap((json) => {
          if (!json || !json.status)
            return rxjs.throwError(new Error("Invalid credentials"));
          const uuid$1 = uuid.uuid(), muxBody = settings;
          muxBody.input || (muxBody.input = [{ type: "video" }]), muxBody.input[0].url = validUrl;
          const query = {
            muxBody: JSON.stringify(muxBody),
            filename: assetName || validUrl.split("/").slice(-1)[0]
          }, dataset = client.config().dataset;
          return rxjs.defer(
            () => client.observable.request({
              url: `/addons/mux/assets/${dataset}`,
              withCredentials: !0,
              method: "POST",
              headers: {
                "MUX-Proxy-UUID": uuid$1,
                "Content-Type": "application/json"
              },
              query
            })
          ).pipe(
            operators.mergeMap((result) => {
              const asset = result && result.results && result.results[0] && result.results[0].document || null;
              return asset ? rxjs.of({ type: "success", id: uuid$1, asset }) : rxjs.throwError(new Error("No asset document returned"));
            })
          );
        })
      )
    ))
  );
}
function uploadFile({
  settings,
  client,
  file,
  assetName
}) {
  return testFile(file).pipe(
    operators.switchMap((fileOptions) => rxjs.concat(
      rxjs.of({ type: "file", file: fileOptions }),
      testSecretsObservable(client).pipe(
        operators.switchMap((json) => {
          if (!json || !json.status)
            return rxjs.throwError(() => new Error("Invalid credentials"));
          const uuid$1 = uuid.uuid(), body = settings;
          return rxjs.concat(
            rxjs.of({ type: "uuid", uuid: uuid$1 }),
            rxjs.defer(
              () => client.observable.request({
                url: `/addons/mux/uploads/${client.config().dataset}`,
                withCredentials: !0,
                method: "POST",
                headers: {
                  "MUX-Proxy-UUID": uuid$1,
                  "Content-Type": "application/json"
                },
                body
              })
            ).pipe(
              operators.mergeMap((result) => createUpChunkObservable(uuid$1, result.upload.url, file).pipe(
                // eslint-disable-next-line no-warning-comments
                // @TODO type the observable events
                // eslint-disable-next-line max-nested-callbacks
                operators.mergeMap((event) => event.type !== "success" ? rxjs.of(event) : rxjs.from(updateAssetDocumentFromUpload(client, uuid$1, assetName)).pipe(
                  // eslint-disable-next-line max-nested-callbacks
                  operators.mergeMap((doc) => rxjs.of({ ...event, asset: doc }))
                )),
                // eslint-disable-next-line max-nested-callbacks
                operators.catchError((err) => cancelUpload(client, uuid$1).pipe(operators.mergeMapTo(rxjs.throwError(err))))
              ))
            )
          );
        })
      )
    ))
  );
}
function getUpload(client, assetId) {
  const { dataset } = client.config();
  return client.request({
    url: `/addons/mux/uploads/${dataset}/${assetId}`,
    withCredentials: !0,
    method: "GET"
  });
}
function pollUpload(client, uuid2) {
  let pollInterval, tries = 0, assetId, upload;
  return new Promise((resolve, reject) => {
    pollInterval = setInterval(async () => {
      try {
        upload = await getUpload(client, uuid2);
      } catch (err) {
        reject(err);
        return;
      }
      assetId = upload && upload.data && upload.data.asset_id, assetId && (clearInterval(pollInterval), resolve(upload)), tries > 10 && (clearInterval(pollInterval), reject(new Error("Upload did not finish"))), tries++;
    }, 2e3);
  });
}
async function updateAssetDocumentFromUpload(client, uuid2, assetName) {
  let upload, asset;
  try {
    upload = await pollUpload(client, uuid2);
  } catch (err) {
    return Promise.reject(err);
  }
  try {
    asset = await getAsset(client, upload.data.asset_id);
  } catch (err) {
    return Promise.reject(err);
  }
  const doc = {
    _id: uuid2,
    _type: "mux.videoAsset",
    status: asset.data.status,
    data: asset.data,
    assetId: asset.data.id,
    playbackId: asset.data.playback_ids[0].id,
    uploadId: upload.data.id,
    filename: assetName || void 0
  };
  return client.createOrReplace(doc).then(() => doc);
}
function testFile(file) {
  if (typeof window < "u" && file instanceof window.File) {
    const fileOptions = optionsFromFile({}, file);
    return rxjs.of(fileOptions);
  }
  return rxjs.throwError(new Error("Invalid file"));
}
function testUrl(url) {
  const error = new Error("Invalid URL");
  if (typeof url != "string")
    return rxjs.throwError(error);
  let formattedUrl = url.trim();
  formattedUrl = formatDriveShareLink(formattedUrl);
  let parsed;
  try {
    parsed = new URL(formattedUrl);
  } catch {
    return rxjs.throwError(error);
  }
  return parsed && !parsed.protocol.match(/http:|https:/) ? rxjs.throwError(error) : rxjs.of(formattedUrl);
}
function optionsFromFile(opts, file) {
  if (!(typeof window > "u" || !(file instanceof window.File)))
    return {
      name: opts.preserveFilename === !1 ? void 0 : file.name,
      type: file.type
    };
}
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed && !!parsed.protocol.match(/http:|https:/);
  } catch {
    return !1;
  }
}
function isServerError(error) {
  return "statusCode" in error && typeof error.statusCode == "number" && 500 <= error.statusCode && error.statusCode <= 600;
}
function extractDroppedFiles(dataTransfer) {
  const files = Array.from(dataTransfer.files || []), items = Array.from(dataTransfer.items || []);
  return files && files.length > 0 ? Promise.resolve(files) : normalizeItems(items).then((arr) => arr.flat());
}
function normalizeItems(items) {
  return Promise.all(
    items.map((item) => {
      if (item.kind === "file" && item.webkitGetAsEntry) {
        let entry;
        try {
          entry = item.webkitGetAsEntry();
        } catch {
          return [item.getAsFile()];
        }
        return entry ? entry.isDirectory ? walk(entry) : [item.getAsFile()] : [];
      }
      if (item.kind === "file") {
        const file = item.getAsFile();
        return Promise.resolve(file ? [file] : []);
      }
      return new Promise((resolve) => item.getAsString(resolve)).then(
        (str) => str ? [new File([str], "unknown.txt", { type: item.type })] : []
      );
    })
  );
}
function isFile(entry) {
  return entry.isFile;
}
function isDirectory(entry) {
  return entry.isDirectory;
}
function walk(entry) {
  if (isFile(entry))
    return new Promise((resolve) => entry.file(resolve)).then((file) => [file]);
  if (isDirectory(entry)) {
    const dir = entry.createReader();
    return new Promise((resolve) => dir.readEntries(resolve)).then((entries) => entries.filter((entr) => !entr.name.startsWith("."))).then((entries) => Promise.all(entries.map(walk)).then((arr) => arr.flat()));
  }
  return Promise.resolve([]);
}
const watchAssetForMetadata = (assetId, props) => {
  const subscription = props.client.listen(
    "*[_id == $id]",
    { id: assetId },
    { includeResult: !0 }
  ).subscribe((event) => {
    if (event.type !== "mutation") return;
    const asset = event.result, data = asset?.data, status = asset?.status;
    data && status === "ready" && (props.onChange(
      sanity.PatchEvent.from([
        sanity.set({ _type: "metadata", ...data }, ["data"])
      ])
    ), subscription.unsubscribe());
  });
};
function SelectAssets({
  asset: selectedAsset,
  onChange,
  setDialogState,
  config
}) {
  const handleSelect = React.useCallback(
    (chosenAsset) => {
      if (chosenAsset?._id || onChange(sanity.PatchEvent.from([sanity.unset(["asset"])])), chosenAsset._id !== selectedAsset?._id) {
        const patches = [];
        patches.push(sanity.setIfMissing({ asset: {}, _type: "mux.video" })), patches.push(sanity.set({ _type: "reference", _weak: !0, _ref: chosenAsset._id }, ["asset"])), config.inlineAssetMetadata && (patches.push(sanity.setIfMissing({ data: {} })), patches.push(sanity.set({ _type: "metadata", ...chosenAsset.data ?? {} }, ["data"]))), onChange(sanity.PatchEvent.from(patches));
      }
      setDialogState(!1);
    },
    [onChange, setDialogState, selectedAsset]
  );
  return /* @__PURE__ */ jsxRuntime.jsx(VideosBrowser, { onSelect: handleSelect, config });
}
const StyledDialog = styledComponents.styled(ui.Dialog)`
  > div[data-ui='DialogCard'] > div[data-ui='Card'] {
    height: 100%;
  }
`;
function InputBrowser({
  setDialogState,
  asset,
  onChange,
  config
}) {
  const id = `InputBrowser${React.useId()}`, handleClose = React.useCallback(() => setDialogState(!1), [setDialogState]);
  return /* @__PURE__ */ jsxRuntime.jsx(
    StyledDialog,
    {
      __unstable_autoFocus: !0,
      header: "Select video",
      id,
      onClose: handleClose,
      width: 2,
      children: /* @__PURE__ */ jsxRuntime.jsx(
        SelectAssets,
        {
          config,
          asset,
          onChange,
          setDialogState
        }
      )
    }
  );
}
const useCancelUpload = (asset, onChange) => {
  const client = useClient();
  return React.useCallback(() => {
    asset && (onChange(sanity.PatchEvent.from(sanity.unset())), asset.assetId && deleteAssetOnMux(client, asset.assetId), asset._id && client.delete(asset._id));
  }, [asset, client, onChange]);
};
styledComponents.styled.div`
  && {
    --media-background-color: transparent;
    --media-button-icon-width: 100%;
    --media-button-icon-height: auto;
    pointer-events: none;
    width: 100%;
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: center;
    media-play-button {
      --media-control-background: transparent;
      --media-control-hover-background: transparent;
      padding: 0;
      width: max(27px, min(9%, 90px));
    }
  }
`;
const TopControls = styledComponents.styled.div`
  position: absolute;
  top: 0;
  right: 0;
  justify-content: flex-end;
  button {
    height: auto;
  }
`, CardWrapper = styledComponents.styled(ui.Card)`
  min-height: 82px;
  box-sizing: border-box;
`, FlexWrapper = styledComponents.styled(ui.Flex)`
  text-overflow: ellipsis;
  overflow: hidden;
`, LeftSection = styledComponents.styled(ui.Stack)`
  position: relative;
  width: 60%;
`, CodeWrapper = styledComponents.styled(ui.Code)`
  position: relative;
  width: 100%;

  code {
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    max-width: 200px;
  }
`, UploadProgress = ({
  progress = 100,
  onCancel,
  filename,
  text = "Uploading"
}) => {
  const isCancelDisabled = progress >= 90;
  return /* @__PURE__ */ jsxRuntime.jsx(CardWrapper, { tone: "primary", padding: 4, border: !0, height: "fill", children: /* @__PURE__ */ jsxRuntime.jsxs(FlexWrapper, { align: "center", justify: "space-between", height: "fill", direction: "row", gap: 2, children: [
    /* @__PURE__ */ jsxRuntime.jsxs(LeftSection, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(ui.Flex, { justify: "center", gap: [3, 3, 2, 2], direction: ["column", "column", "row"], children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Inline, { space: 2, children: [
        text,
        /* @__PURE__ */ jsxRuntime.jsx(CodeWrapper, { size: 1, children: filename || "..." })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { marginTop: 3, radius: 5, shadow: 1, children: /* @__PURE__ */ jsxRuntime.jsx(sanity.LinearProgress, { value: progress }) })
    ] }),
    onCancel ? /* @__PURE__ */ jsxRuntime.jsx(
      ui.Button,
      {
        fontSize: 2,
        text: "Cancel upload",
        mode: "ghost",
        tone: "critical",
        onClick: onCancel,
        disabled: isCancelDisabled
      }
    ) : null
  ] }) });
}, Player = ({ asset, buttons, readOnly, onChange, config }) => {
  const isLoading = React.useMemo(() => asset?.status === "preparing" ? "Preparing the video" : asset?.status === "waiting_for_upload" ? "Waiting for upload to start" : asset?.status === "waiting" ? "Processing upload" : !(asset?.status === "ready" || typeof asset?.status > "u"), [asset]), isPreparingStaticRenditions = React.useMemo(() => {
    if (asset?.data?.static_renditions?.status && asset?.data?.static_renditions?.status !== "disabled")
      return !1;
    const files = asset?.data?.static_renditions?.files;
    return !files || files.length === 0 ? !1 : files.some((file) => file.status === "preparing");
  }, [asset?.data?.static_renditions?.status, asset?.data?.static_renditions?.files]), playRef = React.useRef(null), muteRef = React.useRef(null), handleCancelUpload = useCancelUpload(asset, onChange);
  return React.useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = "button svg { vertical-align: middle; }", playRef.current?.shadowRoot && playRef.current.shadowRoot.appendChild(style), muteRef?.current?.shadowRoot && muteRef.current.shadowRoot.appendChild(style.cloneNode(!0));
  }, []), React.useEffect(() => {
    if (asset?.status === "errored")
      throw handleCancelUpload(), new Error(asset.data?.errors?.messages?.join(" "));
  }, [asset.data?.errors?.messages, asset?.status, handleCancelUpload]), !asset || !asset.status ? null : isLoading ? /* @__PURE__ */ jsxRuntime.jsx(
    UploadProgress,
    {
      progress: 100,
      filename: asset?.filename,
      text: isLoading !== !0 && isLoading || "Waiting for Mux to complete the upload",
      onCancel: readOnly ? void 0 : () => handleCancelUpload()
    }
  ) : /* @__PURE__ */ jsxRuntime.jsxs(VideoPlayer, { asset, hlsConfig: config?.hlsConfig, children: [
    buttons && /* @__PURE__ */ jsxRuntime.jsx(TopControls, { slot: "top-chrome", children: buttons }),
    isPreparingStaticRenditions && /* @__PURE__ */ jsxRuntime.jsx(
      ui.Card,
      {
        padding: 2,
        radius: 1,
        style: {
          background: "var(--card-fg-color)",
          position: "absolute",
          top: "0.5em",
          left: "0.5em"
        },
        children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, style: { color: "var(--card-bg-color)" }, children: "MUX is preparing static renditions, please stand by" })
      }
    )
  ] });
};
function focusRingBorderStyle(border) {
  return `inset 0 0 0 ${border.width}px ${border.color}`;
}
function focusRingStyle(opts) {
  const { base, border, focusRing } = opts, focusRingOutsetWidth = focusRing.offset + focusRing.width, focusRingInsetWidth = 0 - focusRing.offset, bgColor = base ? base.bg : "var(--card-bg-color)";
  return [
    focusRingInsetWidth > 0 && `inset 0 0 0 ${focusRingInsetWidth}px var(--card-focus-ring-color)`,
    border && focusRingBorderStyle(border),
    focusRingInsetWidth < 0 && `0 0 0 ${0 - focusRingInsetWidth}px ${bgColor}`,
    focusRingOutsetWidth > 0 && `0 0 0 ${focusRingOutsetWidth}px var(--card-focus-ring-color)`
  ].filter(Boolean).join(",");
}
const FileButton = styledComponents.styled(ui.MenuItem)(({ theme }) => {
  const { focusRing } = theme.sanity, base = theme.sanity.color.base;
  return styledComponents.css`
    position: relative;

    &:not([data-disabled='true']) {
      &:focus-within {
        box-shadow: ${focusRingStyle({ base, border: { width: 1, color: "var(--card-border-color)" }, focusRing })};
      }
    }

    & input {
      overflow: hidden;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      position: absolute;
      min-width: 0;
      display: block;
      appearance: none;
      padding: 0;
      margin: 0;
      border: 0;
      opacity: 0;
    }
  `;
}), FileInputMenuItem = React__default.default.forwardRef(function(props, forwardedRef) {
  const {
    icon,
    id: idProp,
    accept,
    capture,
    fontSize,
    multiple,
    onSelect,
    space = 3,
    textAlign,
    text,
    disabled,
    ...rest
  } = props, idHook = React.useId(), id = idProp || idHook, handleChange = React__default.default.useCallback(
    (event) => {
      onSelect && event.target.files && onSelect(Array.from(event.target.files));
    },
    [onSelect]
  ), content = /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", justify: "flex-start", children: [
    icon && /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { marginRight: text ? space : void 0, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: fontSize, children: [
      React.isValidElement(icon) && icon,
      reactIs.isValidElementType(icon) && React.createElement(icon)
    ] }) }),
    text && /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { align: textAlign, size: fontSize, textOverflow: "ellipsis", children: text })
  ] });
  return /* @__PURE__ */ jsxRuntime.jsxs(FileButton, { ...rest, htmlFor: id, disabled, ref: forwardedRef, children: [
    content,
    /* @__PURE__ */ jsxRuntime.jsx(
      "input",
      {
        "data-testid": "file-button-input",
        accept,
        capture,
        id,
        multiple,
        onChange: handleChange,
        type: "file",
        value: "",
        disabled
      }
    )
  ] });
}), LockCard = styledComponents.styled(ui.Card)`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.6;
  mix-blend-mode: screen;
  background: transparent;
`, LockButton = styledComponents.styled(ui.Button)`
  background: transparent;
  color: white;
`, isVideoAsset = (asset) => asset._type === "mux.videoAsset";
function PlayerActionsMenu(props) {
  const { asset, readOnly, dialogState, setDialogState, onChange, onSelect, accept } = props, [open, setOpen] = React.useState(!1), [menuElement, setMenuRef] = React.useState(null), isSigned = React.useMemo(() => getPlaybackPolicy(asset)?.policy === "signed", [asset]), { hasConfigAccess } = useAccessControl(props.config), { resyncAsset, isResyncing } = useResyncAsset({ showToast: !0 }), onReset = React.useCallback(() => onChange(sanity.PatchEvent.from(sanity.unset([]))), [onChange]), handleResync = React.useCallback(async () => {
    setOpen(!1), await resyncAsset(asset);
  }, [resyncAsset, asset]);
  return React.useEffect(() => {
    open && dialogState && setOpen(!1);
  }, [dialogState, open]), ui.useClickOutsideEvent(
    () => setOpen(!1),
    () => [menuElement]
  ), /* @__PURE__ */ jsxRuntime.jsxs(ui.Inline, { space: 1, padding: 2, children: [
    isSigned && /* @__PURE__ */ jsxRuntime.jsx(
      ui.Tooltip,
      {
        animate: !0,
        content: /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { padding: 2, children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { muted: !0, size: 1, children: "Signed playback policy" }) }),
        placement: "right",
        portal: !0,
        children: /* @__PURE__ */ jsxRuntime.jsx(LockCard, { radius: 2, margin: 2, scheme: "dark", tone: "positive", children: /* @__PURE__ */ jsxRuntime.jsx(LockButton, { icon: icons.LockIcon, mode: "bleed", tone: "positive" }) })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      ui.Popover,
      {
        animate: !0,
        content: /* @__PURE__ */ jsxRuntime.jsxs(ui.Menu, { ref: setMenuRef, children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { padding: 2, children: /* @__PURE__ */ jsxRuntime.jsx(ui.Label, { muted: !0, size: 1, children: "Replace" }) }),
          /* @__PURE__ */ jsxRuntime.jsx(
            FileInputMenuItem,
            {
              accept,
              icon: icons.UploadIcon,
              onSelect,
              text: "Upload",
              disabled: readOnly,
              fontSize: 1
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(
            ui.MenuItem,
            {
              icon: icons.SearchIcon,
              text: "Browse",
              onClick: () => setDialogState("select-video")
            }
          ),
          isVideoAsset(asset) && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.MenuItem,
              {
                icon: icons.ImageIcon,
                text: "Thumbnail",
                onClick: () => setDialogState("edit-thumbnail")
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.MenuItem,
              {
                icon: icons.TranslateIcon,
                text: "Captions",
                onClick: () => setDialogState("edit-captions")
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.MenuItem,
              {
                icon: icons.SyncIcon,
                text: "Resync from Mux",
                onClick: handleResync,
                disabled: readOnly || isResyncing
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx(ui.MenuDivider, {}),
          /* @__PURE__ */ jsxRuntime.jsx(
            ui.MenuItem,
            {
              icon: icons.DownloadIcon,
              text: "Download",
              onClick: () => setDialogState("download-asset")
            }
          ),
          /* @__PURE__ */ jsxRuntime.jsx(ui.MenuDivider, {}),
          hasConfigAccess && /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.MenuItem,
              {
                icon: icons.PlugIcon,
                text: "Configure API",
                onClick: () => setDialogState("secrets")
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(ui.MenuDivider, {})
          ] }),
          /* @__PURE__ */ jsxRuntime.jsx(
            ui.MenuItem,
            {
              tone: "critical",
              icon: icons.ResetIcon,
              text: "Clear field",
              onClick: onReset,
              disabled: readOnly
            }
          )
        ] }),
        portal: !0,
        open,
        children: /* @__PURE__ */ jsxRuntime.jsx(
          ui.Button,
          {
            icon: icons.EllipsisHorizontalIcon,
            mode: "ghost",
            fontSize: 1,
            onClick: () => {
              setDialogState(!1), setOpen(!0);
            }
          }
        )
      }
    )
  ] });
}
var PlayerActionsMenu$1 = React.memo(PlayerActionsMenu);
function useFetchFileSize(stagedUpload, maxFileSize) {
  const [fileSize, setFileSize] = React.useState(null), [isLoadingFileSize, setIsLoadingFileSize] = React.useState(!1), [canSkipFileSizeValidation, setCanSkipFileSizeValidation] = React.useState(!1);
  return React.useEffect(() => {
    if (stagedUpload.type === "url") {
      setIsLoadingFileSize(!1), setCanSkipFileSizeValidation(!1), setFileSize(null);
      const url = stagedUpload.url;
      (async () => {
        setIsLoadingFileSize(!0);
        try {
          const contentLength = (await fetch(url, { method: "HEAD" })).headers.get("content-length"), newFileSize = contentLength ? parseInt(contentLength, 10) : null;
          setIsLoadingFileSize(!1), newFileSize && setFileSize(newFileSize), newFileSize === null && maxFileSize !== void 0 && setCanSkipFileSizeValidation(!0);
        } catch {
          console.warn("Could not validate file size from URL"), setCanSkipFileSizeValidation(!0), setIsLoadingFileSize(!1);
        }
      })();
    }
    stagedUpload.type === "file" && setFileSize(stagedUpload.files[0].size);
  }, [maxFileSize, stagedUpload, stagedUpload.type]), {
    fileSize,
    isLoadingFileSize,
    canSkipFileSizeValidation
  };
}
function useMediaMetadata(stagedUpload) {
  const [videoAssetMetadata, setVideoAssetMetadata] = React.useState(null), [isLoadingMetadata, setIsLoadingMetadata] = React.useState(!1);
  return React.useEffect(() => {
    let videoSrc = null;
    if (stagedUpload.type === "file") {
      const file = stagedUpload.files[0];
      videoSrc = URL.createObjectURL(file);
    }
    if (stagedUpload.type === "url" && (videoSrc = stagedUpload.url), setVideoAssetMetadata((old) => ({
      ...old,
      duration: void 0,
      width: void 0,
      height: void 0
    })), !videoSrc) return () => null;
    setIsLoadingMetadata(!0);
    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";
    const metadataListeners = [
      () => {
        setIsLoadingMetadata(!1);
      },
      () => {
        const duration = videoElement.duration, width = videoElement.videoWidth, height = videoElement.videoHeight, isAudioOnly = width <= 0 && height <= 0;
        setVideoAssetMetadata((old) => ({
          ...old,
          duration,
          width,
          height,
          isAudioOnly
        }));
      }
    ], cleanupVideo = (videoEl) => {
      const currentVideoSrc = videoEl?.src;
      videoEl && (metadataListeners.forEach(
        (listener) => videoEl.removeEventListener("loadedmetadata", listener)
      ), videoEl.onerror = null, videoEl.src = "", videoEl.load()), currentVideoSrc?.startsWith("blob:") && URL.revokeObjectURL(currentVideoSrc);
    };
    return metadataListeners.push(() => setTimeout(() => cleanupVideo(videoElement), 0)), videoElement.onerror = () => {
      setIsLoadingMetadata(!1), console.warn("Could not read video metadata for validation"), cleanupVideo(videoElement);
    }, metadataListeners.forEach(
      (listener) => videoElement.addEventListener("loadedmetadata", listener)
    ), videoElement.src = videoSrc, () => {
      cleanupVideo(videoElement);
    };
  }, [stagedUpload.type, stagedUpload]), {
    videoAssetMetadata,
    setVideoAssetMetadata,
    isLoadingMetadata
  };
}
function formatBytes(bytes, si = !1, dp = 1) {
  const thresh = si ? 1e3 : 1024;
  if (Math.abs(bytes) < thresh)
    return bytes + " B";
  const units = si ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"] : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u2 = -1;
  const r = 10 ** dp;
  do
    bytes /= thresh, ++u2;
  while (Math.round(Math.abs(bytes) * r) / r >= thresh && u2 < units.length - 1);
  return bytes.toFixed(dp) + " " + units[u2];
}
const ALL_LANGUAGE_CODES = LanguagesList__default.default.getAllCodes().map((code) => ({
  value: code,
  label: LanguagesList__default.default.getNativeName(code)
})), SUBTITLE_LANGUAGES = {
  autogenerated: SUPPORTED_MUX_LANGUAGES.map((lang) => ({
    value: lang.code,
    label: lang.label
  })),
  subtitles: ALL_LANGUAGE_CODES,
  captions: ALL_LANGUAGE_CODES
};
function TextTracksEditor({
  tracks,
  dispatch,
  defaultLang
}) {
  const track = tracks[0];
  return /* @__PURE__ */ jsxRuntime.jsx(sanity.FormField, { title: "Auto-generated subtitle or caption", children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
    /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        ui.Checkbox,
        {
          id: "include-autogenerated-track",
          style: { display: "block" },
          checked: !!track?.language_code,
          onChange: () => {
            dispatch(track ? { action: "track", id: track._id, subAction: "delete" } : {
              action: "track",
              id: uuid.uuid(),
              subAction: "add",
              value: {
                type: "autogenerated",
                name: defaultLang || void 0,
                language_code: defaultLang || void 0
              }
            });
          }
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { flex: 1, paddingLeft: 3, children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { children: /* @__PURE__ */ jsxRuntime.jsx("label", { htmlFor: "checkbox", children: "Generate captions" }) }) })
    ] }),
    track && /* @__PURE__ */ jsxRuntime.jsx(
      ui.Autocomplete,
      {
        id: "text-tract-editor--language",
        value: track.language_code,
        onChange: (newValue) => dispatch({
          action: "track",
          id: track._id,
          subAction: "update",
          value: {
            language_code: newValue,
            name: LanguagesList__default.default.getNativeName(newValue)
          }
        }),
        options: SUBTITLE_LANGUAGES[track.type],
        icon: icons.TranslateIcon,
        placeholder: "Select language",
        filterOption: (query, option) => option.label.toLowerCase().indexOf(query.toLowerCase()) > -1 || option.value.toLowerCase().indexOf(query.toLowerCase()) > -1,
        openButton: !0,
        renderValue: (value) => SUBTITLE_LANGUAGES[track.type].find((l) => l.value === value)?.label || value,
        renderOption: (option) => /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { "data-as": "button", padding: 3, radius: 2, tone: "inherit", children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: 2, textOverflow: "ellipsis", children: [
          option.label,
          " (",
          option.value,
          ")"
        ] }) })
      }
    )
  ] }) });
}
function PlaybackPolicyOption({
  id,
  checked,
  optionName,
  description,
  dispatch,
  action,
  disabled
}) {
  const [scale, setScale] = React.useState(1), boxStyle = {
    outline: "0.01rem solid grey",
    transform: `scale(${scale})`,
    transition: "transform 0.1s ease-in-out",
    cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: "0.25rem"
  }, triggerAnimation = () => {
    setScale(0.98), setTimeout(() => {
      setScale(1);
    }, 100);
  };
  return /* @__PURE__ */ jsxRuntime.jsx("label", { children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { gap: 3, padding: 3, style: boxStyle, children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      ui.Checkbox,
      {
        id,
        required: !0,
        checked,
        onChange: () => {
          action && (triggerAnimation(), dispatch({
            action,
            value: !checked
          }));
        },
        disabled
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsxs(ui.Grid, { gap: 3, children: [
      /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 3, weight: "bold", children: optionName }),
      typeof description == "string" ? /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 2, muted: !0, children: description }) : description
    ] })
  ] }) });
}
function PlaybackPolicyWarning() {
  return /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { padding: 2, style: {
    outline: "0.01rem solid grey",
    backgroundColor: "#979cb0",
    borderRadius: "0.5rem",
    width: "max-content",
    color: "#13141A"
  }, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", gap: 2, children: [
    /* @__PURE__ */ jsxRuntime.jsx(icons.WarningFilledIcon, {}),
    /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, style: {
      color: "#13141A",
      fontWeight: 500
    }, children: "Please select at least one Playback Policy" })
  ] }) });
}
function PlaybackPolicy({
  id,
  config,
  secrets,
  dispatch
}) {
  const noPolicySelected = !(config.public_policy || config.signed_policy || config.drm_policy), drmPolicyDisabled = !secrets.drmConfigId;
  return /* @__PURE__ */ jsxRuntime.jsxs(ui.Grid, { gap: 3, children: [
    /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { weight: "bold", children: "Advanced Playback Policies" }),
    /* @__PURE__ */ jsxRuntime.jsx(
      PlaybackPolicyOption,
      {
        id: `${id}--public`,
        checked: config.public_policy,
        optionName: "Public",
        description: /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 2, muted: !0, children: "Playback IDs are accessible by constructing an HLS URL like" }),
          /* @__PURE__ */ jsxRuntime.jsx(ui.Code, { children: "https://stream.mux.com/{PLAYBACK_ID}" })
        ] }),
        dispatch,
        action: "public_policy"
      }
    ),
    secrets.enableSignedUrls && /* @__PURE__ */ jsxRuntime.jsx(
      PlaybackPolicyOption,
      {
        id: `${id}--signed`,
        checked: config.signed_policy,
        optionName: "Signed",
        description: /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 2, muted: !0, children: "Playback IDs should be used with tokens" }),
          /* @__PURE__ */ jsxRuntime.jsx(ui.Code, { children: "https://stream.mux.com/{PLAYBACK_ID}?token={TOKEN}" }),
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: 2, muted: !0, children: [
            "See",
            " ",
            /* @__PURE__ */ jsxRuntime.jsx(
              "a",
              {
                href: "https://www.mux.com/docs/guides/secure-video-playback",
                target: "_blank",
                rel: "noopener noreferrer",
                children: "Secure video playback"
              }
            ),
            " ",
            "for details about creating tokens."
          ] })
        ] }),
        dispatch,
        action: "signed_policy"
      }
    ),
    drmPolicyDisabled ? /* @__PURE__ */ jsxRuntime.jsx(
      PlaybackPolicyOption,
      {
        id: `${id}--drm`,
        checked: !1,
        optionName: "DRM - Disabled",
        description: /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: 2, muted: !0, children: [
          "To enable DRM add your DRM Configuration Id to your plugin configuration in the API Credentials view.",
          " ",
          /* @__PURE__ */ jsxRuntime.jsx(
            "a",
            {
              href: "https://www.mux.com/support/human",
              target: "_blank",
              rel: "noopener noreferrer",
              children: "Contact us"
            }
          ),
          " ",
          "to get started using DRM."
        ] }) }),
        dispatch,
        disabled: !0
      }
    ) : /* @__PURE__ */ jsxRuntime.jsx(
      PlaybackPolicyOption,
      {
        id: `${id}--drm`,
        checked: config.drm_policy,
        optionName: "DRM",
        description: /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 2, muted: !0, children: "Playback IDs should be used with tokens as with Signed playback, but require extra configuration." }),
          /* @__PURE__ */ jsxRuntime.jsx(ui.Code, { children: "https://stream.mux.com/{PLAYBACK_ID}?token={TOKEN}" }),
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: 2, muted: !0, children: [
            "See",
            " ",
            /* @__PURE__ */ jsxRuntime.jsx(
              "a",
              {
                href: "https://www.mux.com/docs/guides/protect-videos-with-drm#play-drm-protected-videos",
                target: "_blank",
                rel: "noopener noreferrer",
                children: "Protect videos with DRM"
              }
            ),
            " ",
            "for details about configuring your player for DRM playback and",
            " ",
            /* @__PURE__ */ jsxRuntime.jsx(
              "a",
              {
                href: "https://www.mux.com/docs/guides/secure-video-playback",
                target: "_blank",
                rel: "noopener noreferrer",
                children: "Secure video playback"
              }
            ),
            " ",
            "for details about creating tokens."
          ] })
        ] }),
        dispatch,
        action: "drm_policy"
      }
    ),
    noPolicySelected && /* @__PURE__ */ jsxRuntime.jsx(PlaybackPolicyWarning, {})
  ] });
}
const RESOLUTION_TIERS = [
  { value: "1080p", label: "1080p" },
  { value: "1440p", label: "1440p (2k)" },
  { value: "2160p", label: "2160p (4k)" }
], ResolutionTierSelector = ({
  id,
  config,
  dispatch,
  maxSupportedResolution
}) => /* @__PURE__ */ jsxRuntime.jsx(
  sanity.FormField,
  {
    title: "Resolution Tier",
    description: /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
      "The maximum",
      " ",
      /* @__PURE__ */ jsxRuntime.jsx(
        "a",
        {
          href: "https://docs.mux.com/api-reference#video/operation/create-direct-upload",
          target: "_blank",
          rel: "noopener noreferrer",
          children: "resolution_tier"
        }
      ),
      " ",
      "your asset is encoded, stored, and streamed at."
    ] }),
    children: /* @__PURE__ */ jsxRuntime.jsx(ui.Flex, { gap: 3, wrap: "wrap", children: RESOLUTION_TIERS.map(({ value, label }, index) => {
      const inputId = `${id}--type-${value}`;
      return index > maxSupportedResolution ? null : /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", gap: 2, children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Radio,
          {
            checked: config.max_resolution_tier === value,
            name: "asset-resolutiontier",
            onChange: (e) => dispatch({
              action: "max_resolution_tier",
              value: e.currentTarget.value
            }),
            value,
            id: inputId
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { as: "label", htmlFor: inputId, children: label })
      ] }, value);
    }) })
  }
), ADVANCED_RESOLUTIONS = [
  { value: "270p", label: "270p" },
  { value: "360p", label: "360p" },
  { value: "480p", label: "480p" },
  { value: "540p", label: "540p" },
  { value: "720p", label: "720p" },
  { value: "1080p", label: "1080p" },
  { value: "1440p", label: "1440p" },
  { value: "2160p", label: "2160p" }
], StaticRenditionSelector = ({
  id,
  config,
  dispatch
}) => {
  const isAdvancedMode = React.useMemo(() => config.static_renditions.filter(
    (r) => r !== "highest" && r !== "audio-only"
  ).length > 0, [config.static_renditions]), [renditionMode, setRenditionMode] = React.useState(
    isAdvancedMode ? "advanced" : "standard"
  ), toggleRendition = (rendition) => {
    const current = config.static_renditions, hasRendition = current.includes(rendition);
    dispatch(hasRendition ? {
      action: "static_renditions",
      value: current.filter((r) => r !== rendition)
    } : {
      action: "static_renditions",
      value: [...current, rendition]
    });
  }, handleModeChange = (mode) => {
    setRenditionMode(mode), dispatch(mode === "standard" ? {
      action: "static_renditions",
      value: config.static_renditions.filter((r) => r === "highest" || r === "audio-only")
    } : {
      action: "static_renditions",
      value: config.static_renditions.filter((r) => r !== "highest")
    });
  };
  return /* @__PURE__ */ jsxRuntime.jsx(ui.Stack, { space: 3, children: /* @__PURE__ */ jsxRuntime.jsx(
    sanity.FormField,
    {
      title: "Static Renditions",
      description: "Generate downloadable MP4 or M4A files. Note: Mux will not upscale to produce MP4 renditions - renditions that would cause upscaling are skipped.",
      children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 3, children: [
        /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { gap: 3, children: [
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", gap: 2, children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.Radio,
              {
                checked: renditionMode === "standard",
                name: "rendition-mode",
                onChange: () => handleModeChange("standard"),
                value: "standard",
                id: `${id}--mode-standard`
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { as: "label", htmlFor: `${id}--mode-standard`, children: "Standard" })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", gap: 2, children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.Radio,
              {
                checked: renditionMode === "advanced",
                name: "rendition-mode",
                onChange: () => handleModeChange("advanced"),
                value: "advanced",
                id: `${id}--mode-advanced`
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { as: "label", htmlFor: `${id}--mode-advanced`, children: "Advanced" })
          ] })
        ] }),
        renditionMode === "standard" && /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", gap: 2, padding: [0, 2], children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.Checkbox,
              {
                id: `${id}--highest`,
                style: { display: "block" },
                checked: config.static_renditions.includes("highest"),
                onChange: () => toggleRendition("highest")
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { as: "label", htmlFor: `${id}--highest`, children: "Highest Resolution (up to 4K)" })
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", gap: 2, padding: [0, 2], children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.Checkbox,
              {
                id: `${id}--audio-only-standard`,
                style: { display: "block" },
                checked: config.static_renditions.includes("audio-only"),
                onChange: () => toggleRendition("audio-only")
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { as: "label", htmlFor: `${id}--audio-only-standard`, children: "Audio Only (M4A)" })
          ] })
        ] }),
        renditionMode === "advanced" && /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsx(ui.Label, { size: 1, muted: !0, children: "Select specific resolutions:" }),
          /* @__PURE__ */ jsxRuntime.jsx(ui.Flex, { gap: 2, wrap: "wrap", children: ADVANCED_RESOLUTIONS.map(({ value, label }) => {
            const inputId = `${id}--resolution-${value}`;
            return /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", gap: 2, children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                ui.Checkbox,
                {
                  id: inputId,
                  style: { display: "block" },
                  checked: config.static_renditions.includes(value),
                  onChange: () => toggleRendition(value)
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { as: "label", htmlFor: inputId, size: 1, children: label })
            ] }, value);
          }) }),
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", gap: 2, padding: [2, 2, 0, 2], children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.Checkbox,
              {
                id: `${id}--audio-only-advanced`,
                style: { display: "block" },
                checked: config.static_renditions.includes("audio-only"),
                onChange: () => toggleRendition("audio-only")
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { as: "label", htmlFor: `${id}--audio-only-advanced`, children: "Audio Only (M4A)" })
          ] })
        ] })
      ] })
    }
  ) });
}, VIDEO_QUALITY_LEVELS = [
  { value: "basic", label: "Basic" },
  { value: "plus", label: "Plus" },
  { value: "premium", label: "Premium" }
];
function sanitizeStaticRenditions(renditions) {
  const hasHighest = renditions.includes("highest"), hasSpecificResolutions = renditions.some((r) => r !== "highest" && r !== "audio-only");
  return hasHighest && hasSpecificResolutions ? renditions.filter((r) => r === "highest" || r === "audio-only") : renditions;
}
function UploadConfiguration({
  stagedUpload,
  secrets,
  pluginConfig,
  startUpload,
  onClose
}) {
  const id = React.useId(), autoTextTracks = React.useRef(
    pluginConfig.video_quality === "plus" && pluginConfig.defaultAutogeneratedSubtitleLang ? [
      {
        _id: uuid.uuid(),
        type: "autogenerated",
        language_code: pluginConfig.defaultAutogeneratedSubtitleLang,
        name: LanguagesList__default.default.getNativeName(pluginConfig.defaultAutogeneratedSubtitleLang)
      }
    ] : []
  ).current, [config, dispatch] = React.useReducer(
    (prev, action) => {
      switch (action.action) {
        case "video_quality":
          return action.value === "basic" ? Object.assign({}, prev, {
            video_quality: action.value,
            static_renditions: [],
            max_resolution_tier: "1080p",
            text_tracks: prev.text_tracks?.filter(({ type }) => type !== "autogenerated"),
            public_policy: !0,
            signed_policy: !1,
            drm_policy: !1
          }) : Object.assign({}, prev, {
            video_quality: action.value,
            static_renditions: sanitizeStaticRenditions(pluginConfig.static_renditions || []),
            max_resolution_tier: pluginConfig.max_resolution_tier,
            text_tracks: [...autoTextTracks, ...prev.text_tracks || []]
          });
        case "static_renditions":
        case "max_resolution_tier":
        case "normalize_audio":
        case "signed_policy":
          return Object.assign({}, prev, { [action.action]: action.value });
        case "public_policy":
          return Object.assign({}, prev, { [action.action]: action.value });
        case "drm_policy":
          return Object.assign({}, prev, { [action.action]: action.value });
        case "asset_name":
          return Object.assign({}, prev, { [action.action]: action.value });
        // Updating individual tracks
        case "track": {
          const text_tracks = [...prev.text_tracks], target_track_i = text_tracks.findIndex(({ _id: _id2 }) => _id2 === action.id);
          switch (action.subAction) {
            case "add":
              if (target_track_i !== -1) break;
              text_tracks.push({
                _id: action.id,
                ...action.value
              });
              break;
            case "update":
              if (target_track_i === -1) break;
              text_tracks[target_track_i] = {
                ...text_tracks[target_track_i],
                ...action.value
              };
              break;
            case "delete":
              if (target_track_i === -1) break;
              text_tracks.splice(target_track_i, 1);
              break;
          }
          return Object.assign({}, prev, { text_tracks });
        }
        default:
          return prev;
      }
    },
    {
      video_quality: pluginConfig.video_quality,
      max_resolution_tier: pluginConfig.max_resolution_tier,
      static_renditions: sanitizeStaticRenditions(pluginConfig.static_renditions || []),
      signed_policy: secrets.enableSignedUrls && pluginConfig.defaultSigned,
      public_policy: pluginConfig.defaultPublic,
      drm_policy: pluginConfig.defaultDrm && !!secrets.drmConfigId,
      normalize_audio: pluginConfig.normalize_audio,
      text_tracks: autoTextTracks,
      asset_name: stagedUpload.type === "file" ? stagedUpload.files[0].name : stagedUpload.url
    }
  ), [validationError, setValidationError] = React.useState(null), MAX_FILE_SIZE = pluginConfig.maxAssetFileSize, MAX_DURATION_SECONDS = pluginConfig.maxAssetDuration, { fileSize, isLoadingFileSize, canSkipFileSizeValidation } = useFetchFileSize(
    stagedUpload,
    MAX_FILE_SIZE
  ), { videoAssetMetadata, setVideoAssetMetadata, isLoadingMetadata } = useMediaMetadata(stagedUpload);
  React.useEffect(() => {
    fileSize && setVideoAssetMetadata((old) => ({ ...old, size: fileSize }));
  }, [fileSize, setVideoAssetMetadata]), React.useEffect(() => {
    const validateDuration = (duration) => MAX_DURATION_SECONDS && duration > MAX_DURATION_SECONDS ? (setValidationError(
      `Video duration (${formatSeconds(duration)}) exceeds maximum allowed duration of ${formatSeconds(MAX_DURATION_SECONDS)}`
    ), !1) : !0, validateFileSize = (size) => MAX_FILE_SIZE === void 0 || size <= MAX_FILE_SIZE ? !0 : (setValidationError(
      `File size (${formatBytes(size)}) exceeds maximum allowed size of ${formatBytes(MAX_FILE_SIZE)}`
    ), !1), validateDrmAvailability = (isAudioOnly) => config.drm_policy && isAudioOnly ? (setValidationError("Audio-only asset cannot be DRM protected"), !1) : !0;
    let valid = !0;
    videoAssetMetadata?.size && (valid = valid && (canSkipFileSizeValidation || validateFileSize(videoAssetMetadata.size))), videoAssetMetadata?.duration && (valid = valid && validateDuration(videoAssetMetadata.duration)), videoAssetMetadata?.isAudioOnly != null && (valid = valid && validateDrmAvailability(videoAssetMetadata.isAudioOnly)), valid && setValidationError(null);
  }, [
    MAX_FILE_SIZE,
    MAX_DURATION_SECONDS,
    canSkipFileSizeValidation,
    videoAssetMetadata?.duration,
    videoAssetMetadata?.size,
    videoAssetMetadata?.height,
    videoAssetMetadata?.width,
    videoAssetMetadata,
    config.drm_policy,
    validationError
  ]);
  const { disableTextTrackConfig, disableUploadConfig, disableAssetNameConfig } = pluginConfig, skipConfig = disableTextTrackConfig && disableUploadConfig && disableAssetNameConfig;
  if (React.useEffect(() => {
    skipConfig && startUpload(formatUploadConfig(config, secrets), config.asset_name);
  }, []), skipConfig) return null;
  const basicConfig = config.video_quality !== "plus" && config.video_quality !== "premium", playbackPolicySelected = config.public_policy || config.signed_policy || config.drm_policy, maxSupportedResolution = RESOLUTION_TIERS.findIndex(
    (rt) => rt.value === pluginConfig.max_resolution_tier
  );
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.Dialog,
    {
      animate: !0,
      open: !0,
      id: "upload-configuration",
      zOffset: 1e3,
      width: 1,
      header: "Configure Mux Upload",
      onClose,
      children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { padding: 4, space: 2, children: [
        validationError && /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { padding: 3, tone: "critical", radius: 2, marginBottom: 2, children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { gap: 2, align: "flex-start", children: [
          /* @__PURE__ */ jsxRuntime.jsx(icons.ErrorOutlineIcon, { width: 20, height: 20 }),
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, weight: "semibold", children: "Validation Error" }),
            /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, children: validationError })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntime.jsx(ui.Label, { size: 3, children: "FILE TO UPLOAD" }),
        /* @__PURE__ */ jsxRuntime.jsx(
          ui.Card,
          {
            tone: "transparent",
            border: !0,
            padding: 3,
            paddingY: 4,
            style: { borderRadius: "0.1865rem" },
            children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { gap: 2, children: [
              /* @__PURE__ */ jsxRuntime.jsx(icons.DocumentVideoIcon, { fontSize: "2em" }),
              /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 2, children: [
                /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { textOverflow: "ellipsis", as: "h2", size: 3, children: stagedUpload.type === "file" ? stagedUpload.files[0].name : stagedUpload.url }),
                /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { as: "p", size: 1, muted: !0, children: stagedUpload.type === "file" ? `Direct File Upload (${formatBytes(stagedUpload.files[0].size)})` : videoAssetMetadata?.size ? `File From URL (${formatBytes(videoAssetMetadata.size)})` : isLoadingFileSize ? "File From URL (Loading size...)" : "File From URL (Unknown size)" }),
                stagedUpload.type === "file" && /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 1, children: [
                  isLoadingMetadata && /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { as: "p", size: 1, muted: !0, children: "Reading video metadata..." }),
                  videoAssetMetadata?.duration && !validationError && /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { as: "p", size: 1, muted: !0, children: [
                    "Duration: ",
                    formatSeconds(videoAssetMetadata.duration)
                  ] })
                ] })
              ] })
            ] })
          }
        ),
        !disableAssetNameConfig && /* @__PURE__ */ jsxRuntime.jsx(
          sanity.FormField,
          {
            title: "Asset Name",
            inputId: "upload-config-set-asset-name",
            description: "Give a friendly name to your asset. This name will be displayed in the asset library on Sanity.",
            children: /* @__PURE__ */ jsxRuntime.jsx(
              ui.TextInput,
              {
                id: "upload-config-set-asset-name",
                value: config.asset_name ?? "",
                placeholder: "[Notion ID] - Name of the asset (recommended format)",
                onChange: (e) => dispatch({ action: "asset_name", value: e.currentTarget.value })
              }
            )
          }
        ),
        !disableUploadConfig && /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 3, paddingBottom: 2, children: [
          /* @__PURE__ */ jsxRuntime.jsx(
            sanity.FormField,
            {
              title: "Video Quality Level",
              description: /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
                "The video quality level informs the cost, quality, and available platform features for the asset.",
                " ",
                /* @__PURE__ */ jsxRuntime.jsx(
                  "a",
                  {
                    href: "https://docs.mux.com/guides/use-encoding-tiers",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    children: "See the Mux guide for more details."
                  }
                )
              ] }),
              children: /* @__PURE__ */ jsxRuntime.jsx(ui.Flex, { gap: 3, children: VIDEO_QUALITY_LEVELS.map(({ value, label }) => {
                const inputId = `${id}--encodingtier-${value}`;
                return /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", gap: 2, children: [
                  /* @__PURE__ */ jsxRuntime.jsx(
                    ui.Radio,
                    {
                      checked: config.video_quality === value,
                      name: "asset-encodingtier",
                      onChange: (e) => dispatch({
                        action: "video_quality",
                        value: e.currentTarget.value
                      }),
                      value,
                      id: inputId
                    }
                  ),
                  /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { as: "label", htmlFor: inputId, children: label })
                ] }, value);
              }) })
            }
          ),
          !basicConfig && /* @__PURE__ */ jsxRuntime.jsx(sanity.FormField, { title: "Additional Configuration", children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Stack, { space: 3, children: [
            /* @__PURE__ */ jsxRuntime.jsx(PlaybackPolicy, { id, config, secrets, dispatch }),
            maxSupportedResolution > 0 && /* @__PURE__ */ jsxRuntime.jsx(
              ResolutionTierSelector,
              {
                id,
                config,
                dispatch,
                maxSupportedResolution
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(StaticRenditionSelector, { id, config, dispatch }),
            !disableTextTrackConfig && /* @__PURE__ */ jsxRuntime.jsx(
              TextTracksEditor,
              {
                tracks: config.text_tracks,
                dispatch,
                defaultLang: pluginConfig.defaultAutogeneratedSubtitleLang
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(ui.Box, { marginTop: 4, children: /* @__PURE__ */ jsxRuntime.jsx(
          ui.Button,
          {
            disabled: !basicConfig && !playbackPolicySelected || validationError !== null || isLoadingMetadata || isLoadingFileSize && !canSkipFileSizeValidation,
            icon: icons.UploadIcon,
            text: "Upload",
            tone: "positive",
            onClick: () => {
              validationError || startUpload(formatUploadConfig(config, secrets), config.asset_name);
            }
          }
        ) })
      ] })
    }
  );
}
function setAdvancedPlaybackPolicy(config, secrets) {
  const advanced_playback_policies = [];
  return config.public_policy && advanced_playback_policies.push({ policy: "public" }), config.signed_policy && advanced_playback_policies.push({ policy: "signed" }), config.drm_policy && (secrets.drmConfigId ? advanced_playback_policies.push({
    policy: "drm",
    drm_configuration_id: secrets.drmConfigId ?? void 0
  }) : console.error("Selected DRM Policy but missing DRM Configuration Id")), advanced_playback_policies;
}
function formatUploadConfig(config, secrets) {
  const generated_subtitles = config.text_tracks.filter(isAutogeneratedTrack).map((track) => ({
    name: track.name,
    language_code: track.language_code
  }));
  return {
    input: [
      {
        type: "video",
        generated_subtitles: generated_subtitles.length > 0 ? generated_subtitles : void 0
      },
      ...config.text_tracks.filter(isCustomTextTrack).reduce(
        (acc, track) => (track.language_code && track.file && track.name && acc.push({
          url: track.file.contents,
          type: "text",
          text_type: track.type === "subtitles" ? "subtitles" : void 0,
          language_code: track.language_code,
          name: track.name,
          closed_captions: track.type === "captions"
        }), acc),
        []
      )
    ],
    static_renditions: config.static_renditions.length > 0 ? config.static_renditions.map((resolution) => ({ resolution })) : void 0,
    advanced_playback_policies: setAdvancedPlaybackPolicy(config, secrets),
    max_resolution_tier: config.max_resolution_tier,
    video_quality: config.video_quality,
    normalize_audio: config.normalize_audio
  };
}
function withFocusRing(component) {
  return styledComponents.styled(component)((props) => {
    const border = {
      width: props.$border ? 1 : 0,
      color: "var(--card-border-color)"
    };
    return styledComponents.css`
      --card-focus-box-shadow: ${focusRingBorderStyle(border)};

      border-radius: ${ui.rem(props.theme.sanity.radius[1])};
      outline: none;
      box-shadow: var(--card-focus-box-shadow);

      &:focus {
        --card-focus-box-shadow: ${focusRingStyle({
      base: props.theme.sanity.color.base,
      border,
      focusRing: props.theme.sanity.focusRing
    })};
      }
    `;
  });
}
const UploadCardWithFocusRing = withFocusRing(ui.Card), UploadCard = React.forwardRef(
  ({ children, tone, onPaste, onDrop, onDragEnter, onDragLeave, onDragOver }, forwardedRef) => {
    const inputRef = React.useRef(null), handleKeyDown = React.useCallback((event) => {
      event.target.closest("#vtt-url") || (event.ctrlKey || event.metaKey) && event.key === "v" && inputRef.current.focus();
    }, []);
    return /* @__PURE__ */ jsxRuntime.jsxs(
      UploadCardWithFocusRing,
      {
        tone,
        ref: forwardedRef,
        padding: 0,
        radius: 2,
        shadow: 0,
        tabIndex: 0,
        onKeyDown: handleKeyDown,
        onPaste,
        onDrop,
        onDragEnter,
        onDragLeave,
        onDragOver,
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(HiddenInput$1, { ref: inputRef }),
          children
        ]
      }
    );
  }
), HiddenInput$1 = styledComponents.styled.input.attrs({ type: "text" })`
  position: absolute;
  border: 0;
  color: white;
  opacity: 0;

  &:focus {
    outline: none;
  }
`, HiddenInput = styledComponents.styled.input`
  overflow: hidden;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  position: absolute;
  z-index: -1;
`, Label = styledComponents.styled.label`
  position: relative;
`, FileInputButton = ({ onSelect, accept, ...props }) => {
  const inputId = `FileSelect${React.useId()}`, inputRef = React.useRef(null), handleSelect = React.useCallback(
    (event) => {
      onSelect && onSelect(event.target.files);
    },
    [onSelect]
  ), handleButtonClick = React.useCallback(() => inputRef.current?.click(), []);
  return /* @__PURE__ */ jsxRuntime.jsxs(Label, { htmlFor: inputId, children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      HiddenInput,
      {
        accept,
        ref: inputRef,
        tabIndex: 0,
        type: "file",
        id: inputId,
        onChange: handleSelect,
        value: ""
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      ui.Button,
      {
        onClick: handleButtonClick,
        mode: "default",
        tone: "primary",
        style: { width: "100%" },
        ...props
      }
    )
  ] });
};
function formatAcceptString(accept) {
  return accept.split(",").map((type) => type.trim().replace("/*", "")).join(" or ");
}
function UploadPlaceholder(props) {
  const { setDialogState, readOnly, onSelect, hovering, needsSetup, accept } = props, handleBrowse = React.useCallback(() => setDialogState("select-video"), [setDialogState]), handleConfigureApi = React.useCallback(() => setDialogState("secrets"), [setDialogState]), { hasConfigAccess } = useAccessControl(props.config);
  return /* @__PURE__ */ jsxRuntime.jsx(
    ui.Card,
    {
      sizing: "border",
      tone: readOnly ? "transparent" : "inherit",
      border: !0,
      radius: 2,
      paddingX: 3,
      paddingY: 1,
      style: hovering ? { borderColor: "transparent" } : void 0,
      children: /* @__PURE__ */ jsxRuntime.jsxs(
        ui.Flex,
        {
          align: "center",
          justify: "space-between",
          gap: 4,
          direction: ["column", "column", "row"],
          paddingY: 2,
          sizing: "border",
          children: [
            /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { align: "center", justify: "flex-start", gap: 2, flex: 1, children: [
              /* @__PURE__ */ jsxRuntime.jsx(ui.Flex, { justify: "center", children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { muted: !0, children: /* @__PURE__ */ jsxRuntime.jsx(icons.DocumentVideoIcon, {}) }) }),
              /* @__PURE__ */ jsxRuntime.jsx(ui.Flex, { justify: "center", children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: 1, muted: !0, children: [
                "Drag ",
                formatAcceptString(accept),
                " file or paste URL here"
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs(ui.Inline, { space: 2, children: [
              /* @__PURE__ */ jsxRuntime.jsx(
                FileInputButton,
                {
                  accept,
                  mode: "bleed",
                  tone: "default",
                  icon: icons.UploadIcon,
                  text: "Upload",
                  onSelect
                }
              ),
              /* @__PURE__ */ jsxRuntime.jsx(ui.Button, { mode: "bleed", icon: icons.SearchIcon, text: "Select", onClick: handleBrowse }),
              hasConfigAccess && /* @__PURE__ */ jsxRuntime.jsx(
                ui.Button,
                {
                  padding: 3,
                  radius: 3,
                  tone: needsSetup ? "critical" : void 0,
                  onClick: handleConfigureApi,
                  icon: icons.PlugIcon,
                  mode: "bleed",
                  title: "Configure plugin credentials"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
const INITIAL_STATE = {
  stagedUpload: null,
  uploadStatus: null,
  error: null
};
function Uploader(props) {
  const toast = ui.useToast(), containerRef = React.useRef(null), dragEnteredEls = React.useRef([]), [dragState, setDragState] = React.useState(null), cancelUploadButton = React.useRef(
    (() => {
      const events$ = new rxjs.Subject();
      return {
        observable: events$.asObservable(),
        handleClick: ((event) => events$.next(event))
      };
    })()
  ).current, uploadRef = React.useRef(null), uploadingDocumentId = React.useRef(null), [state, dispatch] = React.useReducer(
    (prev, action) => {
      switch (action.action) {
        case "stageUpload":
          return Object.assign({}, INITIAL_STATE, { stagedUpload: action.input });
        case "commitUpload":
          return Object.assign({}, prev, { uploadStatus: { progress: 0 } });
        case "progressInfo": {
          const { type, action: _, ...payload } = action;
          return Object.assign({}, prev, {
            uploadStatus: {
              ...prev.uploadStatus,
              progress: prev.uploadStatus.progress,
              ...payload
            }
          });
        }
        case "progress":
          return Object.assign({}, prev, {
            uploadStatus: {
              ...prev.uploadStatus,
              progress: action.percent
            }
          });
        case "reset":
        case "complete":
          return uploadRef.current?.unsubscribe(), uploadRef.current = null, uploadingDocumentId.current = null, INITIAL_STATE;
        case "error": {
          uploadRef.current?.unsubscribe(), uploadRef.current = null, uploadingDocumentId.current = null;
          let error = action.error;
          return isServerError(action.error) && hasPlaybackPolicy(action.settings, "drm") && (error = new Error(
            "Unknown Error while uploading DRM protected content. Make sure your DRM configuration ID is valid and set correctly"
          )), Object.assign({}, INITIAL_STATE, { error });
        }
        default:
          return prev;
      }
    },
    {
      stagedUpload: null,
      uploadStatus: null,
      error: null
    }
  );
  React.useEffect(() => {
    const cleanup = () => {
      if (uploadRef.current && !uploadRef.current.closed && uploadRef.current.unsubscribe(), uploadingDocumentId.current && props.asset?._id !== uploadingDocumentId.current) {
        const docId = uploadingDocumentId.current;
        uploadingDocumentId.current = null, props.client.delete(docId).catch((err) => {
          console.warn("Failed to cleanup orphaned upload document:", err);
        });
      }
    }, handleBeforeUnload = () => {
      cleanup();
    };
    return window.addEventListener("beforeunload", handleBeforeUnload), window.addEventListener("pagehide", handleBeforeUnload), () => {
      window.removeEventListener("beforeunload", handleBeforeUnload), window.removeEventListener("pagehide", handleBeforeUnload), cleanup();
    };
  }, [props.client, props.asset?._id]);
  const startUpload = (settings, assetName) => {
    const { stagedUpload } = state;
    if (!stagedUpload || uploadRef.current) return;
    dispatch({ action: "commitUpload" });
    let uploadObservable;
    switch (stagedUpload.type) {
      case "url":
        uploadObservable = uploadUrl({
          client: props.client,
          url: stagedUpload.url,
          settings,
          assetName: assetName || void 0
        });
        break;
      case "file":
        uploadObservable = uploadFile({
          client: props.client,
          file: stagedUpload.files[0],
          settings,
          assetName: assetName || void 0
        }).pipe(
          operators.takeUntil(
            cancelUploadButton.observable.pipe(
              operators.tap(() => {
                uploadingDocumentId.current && (props.client.delete(uploadingDocumentId.current), uploadingDocumentId.current = null);
              })
            )
          )
        );
        break;
    }
    uploadRef.current = uploadObservable.subscribe({
      next: (event) => {
        switch (event.type) {
          case "uuid":
            uploadingDocumentId.current = event.uuid, dispatch({ action: "progressInfo", ...event });
            break;
          case "file":
          case "url":
            dispatch({ action: "progressInfo", ...event });
            break;
          case "progress":
            dispatch({ action: "progress", percent: event.percent });
            break;
          case "success":
            dispatch({ action: "progress", percent: 100 }), uploadingDocumentId.current = null;
            const patches = [];
            patches.push(sanity.setIfMissing({ asset: {}, _type: "mux.video" })), patches.push(sanity.set({ _type: "reference", _weak: !0, _ref: event.asset._id }, ["asset"])), props.config.inlineAssetMetadata && (patches.push(sanity.setIfMissing({ data: {} })), patches.push(sanity.set({ _type: "metadata", ...event.asset.data ?? {} }, ["data"]))), props.onChange(sanity.PatchEvent.from(patches)), props.config.inlineAssetMetadata && watchAssetForMetadata(event.asset._id, props);
            break;
        }
      },
      complete: () => dispatch({ action: "complete" }),
      error: (error) => dispatch({ action: "error", error, settings })
    });
  }, invalidFileToast = React.useCallback(() => {
    toast.push({
      status: "error",
      title: `Invalid file type. Accepted types: ${props.config.acceptedMimeTypes?.join(", ")}`
    });
  }, [props.config.acceptedMimeTypes, toast]), isInvalidFile = (files) => Array.from(files).some((file) => !props.config.acceptedMimeTypes?.some((acceptedType) => {
    const pattern = `^${acceptedType.replace("*", ".*")}$`;
    return new RegExp(pattern).test(file.type);
  })), handleUpload = (files) => {
    isInvalidFile(files) || dispatch({
      action: "stageUpload",
      input: { type: "file", files }
    });
  }, handlePaste = (event) => {
    if (event.target.closest("#vtt-url"))
      return;
    event.preventDefault(), event.stopPropagation();
    const url = (event.clipboardData || window.clipboardData)?.getData("text")?.trim();
    if (!isValidUrl(url)) {
      toast.push({ status: "error", title: "Invalid URL for Mux video input." });
      return;
    }
    dispatch({ action: "stageUpload", input: { type: "url", url } });
  }, handleDrop = (event) => {
    if (event.preventDefault(), event.stopPropagation(), dragState === "invalid") {
      invalidFileToast(), setDragState(null);
      return;
    }
    setDragState(null), extractDroppedFiles(event.nativeEvent.dataTransfer).then((files) => {
      dispatch({
        action: "stageUpload",
        input: { type: "file", files }
      });
    });
  }, handleDragOver = (event) => {
    event.preventDefault(), event.stopPropagation();
  }, handleDragEnter = (event) => {
    event.stopPropagation(), dragEnteredEls.current.push(event.target);
    const type = event.dataTransfer.items?.[0]?.type, isValidType = props.config.acceptedMimeTypes?.some((acceptedType) => {
      const pattern = `^${acceptedType.replace("*", ".*")}$`;
      return new RegExp(pattern).test(type);
    });
    setDragState(isValidType ? "valid" : "invalid");
  }, handleDragLeave = (event) => {
    event.stopPropagation();
    const idx = dragEnteredEls.current.indexOf(event.target);
    idx > -1 && dragEnteredEls.current.splice(idx, 1), dragEnteredEls.current.length === 0 && setDragState(null);
  };
  if (state.error !== null) {
    const error = state.error;
    return /* @__PURE__ */ jsxRuntime.jsxs(ui.Flex, { gap: 3, direction: "column", justify: "center", align: "center", children: [
      /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 5, muted: !0, children: /* @__PURE__ */ jsxRuntime.jsx(icons.ErrorOutlineIcon, {}) }),
      /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { children: "Something went wrong" }),
      error instanceof Error && error.message && /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: 1, muted: !0, weight: "semibold", style: { textAlign: "center" }, children: error.message }),
      /* @__PURE__ */ jsxRuntime.jsx(ui.Button, { text: "Upload another file", onClick: () => dispatch({ action: "reset" }) })
    ] });
  }
  if (state.uploadStatus !== null) {
    const { uploadStatus } = state;
    return /* @__PURE__ */ jsxRuntime.jsx(
      UploadProgress,
      {
        onCancel: cancelUploadButton.handleClick,
        progress: uploadStatus.progress,
        filename: uploadStatus.file?.name || uploadStatus.url
      }
    );
  }
  if (state.stagedUpload !== null)
    return /* @__PURE__ */ jsxRuntime.jsx(
      UploadConfiguration,
      {
        stagedUpload: state.stagedUpload,
        pluginConfig: props.config,
        secrets: props.secrets,
        startUpload,
        onClose: () => dispatch({ action: "reset" })
      }
    );
  let tone;
  dragState && (tone = dragState === "valid" ? "positive" : "critical");
  const acceptMimeString = props.config?.acceptedMimeTypes?.length ? props.config.acceptedMimeTypes.join(",") : "video/*, audio/*";
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      UploadCard,
      {
        tone,
        onDrop: handleDrop,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDragEnter: handleDragEnter,
        onPaste: handlePaste,
        ref: containerRef,
        children: props.asset ? /* @__PURE__ */ jsxRuntime.jsx(
          DialogStateProvider,
          {
            dialogState: props.dialogState,
            setDialogState: props.setDialogState,
            children: /* @__PURE__ */ jsxRuntime.jsx(
              Player,
              {
                readOnly: props.readOnly,
                asset: props.asset,
                onChange: props.onChange,
                config: props.config,
                buttons: /* @__PURE__ */ jsxRuntime.jsx(
                  PlayerActionsMenu$1,
                  {
                    accept: acceptMimeString,
                    asset: props.asset,
                    dialogState: props.dialogState,
                    setDialogState: props.setDialogState,
                    onChange: props.onChange,
                    onSelect: handleUpload,
                    readOnly: props.readOnly,
                    config: props.config
                  }
                )
              }
            )
          }
        ) : /* @__PURE__ */ jsxRuntime.jsx(
          UploadPlaceholder,
          {
            accept: acceptMimeString,
            hovering: dragState !== null,
            onSelect: handleUpload,
            readOnly: !!props.readOnly,
            setDialogState: props.setDialogState,
            needsSetup: props.needsSetup,
            config: props.config
          }
        )
      }
    ),
    props.dialogState === "select-video" && /* @__PURE__ */ jsxRuntime.jsx(
      InputBrowser,
      {
        config: props.config,
        asset: props.asset,
        onChange: props.onChange,
        setDialogState: props.setDialogState
      }
    )
  ] });
}
const Input = (props) => {
  const client = useClient(), secretDocumentValues = useSecretsDocumentValues(), assetDocumentValues = useAssetDocumentValues(props.value?.asset), poll = useMuxPolling(props.readOnly ? void 0 : assetDocumentValues?.value || void 0), [dialogState, setDialogState] = useDialogState(), { hasConfigAccess } = useAccessControl(props.config), error = secretDocumentValues.error || assetDocumentValues.error || poll.error;
  if (error)
    throw error;
  const isLoading = secretDocumentValues.isLoading || assetDocumentValues.isLoading;
  return /* @__PURE__ */ jsxRuntime.jsx(ui.Card, { children: /* @__PURE__ */ jsxRuntime.jsx(ErrorBoundaryCard$1, { schemaType: props.schemaType, children: /* @__PURE__ */ jsxRuntime.jsx(React.Suspense, { fallback: /* @__PURE__ */ jsxRuntime.jsx(InputFallback, {}), children: isLoading ? /* @__PURE__ */ jsxRuntime.jsx(InputFallback, {}) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    secretDocumentValues.value.needsSetup && !assetDocumentValues.value ? /* @__PURE__ */ jsxRuntime.jsx(Onboard, { setDialogState, config: props.config }) : /* @__PURE__ */ jsxRuntime.jsx(
      Uploader,
      {
        ...props,
        config: props.config,
        onChange: props.onChange,
        client,
        secrets: secretDocumentValues.value.secrets,
        asset: assetDocumentValues.value,
        dialogState,
        setDialogState,
        needsSetup: secretDocumentValues.value.needsSetup
      }
    ),
    dialogState === "secrets" && hasConfigAccess && /* @__PURE__ */ jsxRuntime.jsx(
      ConfigureApiDialog,
      {
        setDialogState,
        secrets: secretDocumentValues.value.secrets
      }
    )
  ] }) }) }) });
};
var Input$1 = React.memo(Input);
function muxVideoCustomRendering(config) {
  return {
    components: {
      input: (props) => /* @__PURE__ */ jsxRuntime.jsx(Input$1, { config: { ...config, ...props.schemaType.options }, ...props })
    },
    preview: {
      select: {
        filename: "asset.filename",
        playbackId: "asset.playbackId",
        status: "asset.status",
        assetId: "asset.assetId",
        thumbTime: "asset.thumbTime",
        data: "asset.data"
      },
      prepare: (asset) => {
        const { filename, playbackId, status } = asset;
        return {
          title: filename || playbackId || "",
          subtitle: status ? `status: ${status}` : null,
          media: asset.playbackId ? /* @__PURE__ */ jsxRuntime.jsx(VideoThumbnail, { asset, width: 64 }) : null
        };
      }
    }
  };
}
const muxVideoSchema = {
  name: "mux.video",
  type: "object",
  title: "Video asset reference",
  fields: [
    {
      title: "Video",
      name: "asset",
      type: "reference",
      weak: !0,
      to: [{ type: "mux.videoAsset" }]
    }
  ]
}, muxTrack = {
  name: "mux.track",
  type: "object",
  fields: [
    { type: "string", name: "id" },
    { type: "string", name: "type" },
    { type: "number", name: "max_width" },
    { type: "number", name: "max_frame_rate" },
    { type: "number", name: "duration" },
    { type: "number", name: "max_height" },
    { type: "string", name: "language_code" },
    { type: "string", name: "name" },
    { type: "string", name: "status" },
    { type: "string", name: "text_source" },
    { type: "string", name: "text_type" }
  ]
}, muxPlaybackId = {
  name: "mux.playbackId",
  type: "object",
  fields: [
    { type: "string", name: "id" },
    { type: "string", name: "policy" }
  ]
}, muxStaticRenditionFile = {
  name: "mux.staticRenditionFile",
  type: "object",
  fields: [
    { type: "string", name: "name" },
    { type: "string", name: "ext" },
    { type: "number", name: "height" },
    { type: "number", name: "width" },
    { type: "number", name: "bitrate" },
    { type: "string", name: "filesize" },
    { type: "string", name: "type" },
    { type: "string", name: "status" },
    { type: "string", name: "resolution_tier" },
    { type: "string", name: "resolution" },
    { type: "string", name: "id" },
    { type: "string", name: "passthrough" }
  ]
}, muxStaticRenditions = {
  name: "mux.staticRenditions",
  type: "object",
  fields: [
    { type: "string", name: "status" },
    {
      name: "files",
      type: "array",
      of: [{ type: "mux.staticRenditionFile" }]
    }
  ]
}, muxAssetData = {
  name: "mux.assetData",
  title: "Mux asset data",
  type: "object",
  fields: [
    {
      type: "string",
      name: "resolution_tier"
    },
    {
      type: "string",
      name: "upload_id"
    },
    {
      type: "string",
      name: "created_at"
    },
    {
      type: "string",
      name: "id"
    },
    {
      type: "string",
      name: "status"
    },
    {
      type: "string",
      name: "max_stored_resolution"
    },
    {
      type: "string",
      name: "passthrough"
    },
    {
      type: "string",
      name: "encoding_tier"
    },
    {
      type: "string",
      name: "video_quality"
    },
    {
      type: "string",
      name: "master_access"
    },
    {
      type: "string",
      name: "aspect_ratio"
    },
    {
      type: "number",
      name: "duration"
    },
    {
      type: "number",
      name: "max_stored_frame_rate"
    },
    {
      type: "string",
      name: "mp4_support"
    },
    {
      type: "string",
      name: "max_resolution_tier"
    },
    {
      name: "tracks",
      type: "array",
      of: [{ type: "mux.track" }]
    },
    {
      name: "playback_ids",
      type: "array",
      of: [{ type: "mux.playbackId" }]
    },
    {
      name: "static_renditions",
      type: "mux.staticRenditions"
    }
  ]
}, muxVideoAsset = {
  name: "mux.videoAsset",
  type: "document",
  title: "Video asset",
  fields: [
    {
      type: "string",
      name: "status"
    },
    {
      type: "string",
      name: "assetId"
    },
    {
      type: "string",
      name: "playbackId"
    },
    {
      type: "string",
      name: "filename"
    },
    {
      type: "number",
      name: "thumbTime"
    },
    {
      type: "mux.assetData",
      name: "data"
    }
  ]
}, schemaTypes = [
  muxTrack,
  muxPlaybackId,
  muxStaticRenditionFile,
  muxStaticRenditions,
  muxAssetData,
  muxVideoAsset
], defaultConfig = {
  static_renditions: [],
  mp4_support: "none",
  video_quality: "plus",
  max_resolution_tier: "1080p",
  normalize_audio: !1,
  defaultPublic: !0,
  defaultSigned: !1,
  defaultDrm: !1,
  inlineAssetMetadata: !1,
  tool: DEFAULT_TOOL_CONFIG,
  allowedRolesForConfiguration: [],
  acceptedMimeTypes: ["video/*", "audio/*"]
};
function convertLegacyConfig(config) {
  return config.static_renditions && config.static_renditions.length > 0 ? { static_renditions: config.static_renditions } : config.mp4_support === "standard" ? { static_renditions: ["highest"] } : { static_renditions: [] };
}
const muxInput = sanity.definePlugin((userConfig) => {
  if (typeof userConfig == "object" && "encoding_tier" in userConfig) {
    const deprecated_encoding_tier = userConfig.encoding_tier;
    userConfig.video_quality || (deprecated_encoding_tier === "baseline" && (userConfig.video_quality = "basic"), deprecated_encoding_tier === "smart" && (userConfig.video_quality = "plus"));
  }
  const config = {
    ...defaultConfig,
    ...userConfig || {},
    ...convertLegacyConfig(userConfig || {})
  };
  return {
    name: "mux-input",
    schema: {
      types: [
        ...schemaTypes,
        {
          ...muxVideoSchema,
          ...muxVideoCustomRendering(config)
        }
      ]
    },
    tools: config.tool === !1 ? void 0 : [createStudioTool(config)]
  };
});
exports.defaultConfig = defaultConfig;
exports.muxInput = muxInput;
//# sourceMappingURL=index.js.map
