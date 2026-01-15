import { useClient as useClient$1, createHookFromObservableFactory, useDocumentStore, collate, useDocumentValues, truncateString, useFormattedDuration, SanityDefaultPreview, useTimeAgo, TextWithTone, isRecord, getPreviewStateObservable, getPreviewValueWithFallback, DocumentPreviewPresence, useDocumentPreviewStore, useSchema, useDocumentPresence, PreviewCard, useCurrentUser, isReference, useProjectId, useDataset, PatchEvent, set, unset, setIfMissing, LinearProgress, FormField as FormField$2, definePlugin } from "sanity";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { ErrorOutlineIcon, InfoOutlineIcon, RetryIcon, CheckmarkCircleIcon, RetrieveIcon, SyncIcon, SortIcon, WarningOutlineIcon, EditIcon, PublishIcon, DocumentIcon, TrashIcon, RevertIcon, SearchIcon, ClockIcon, CropIcon, CalendarIcon, TagIcon, CheckmarkIcon, LockIcon, PlayIcon, ChevronLeftIcon, ChevronRightIcon, PlugIcon, EllipsisHorizontalIcon, UploadIcon, ImageIcon, ResetIcon, TranslateIcon, WarningFilledIcon, DocumentVideoIcon } from "@sanity/icons";
import { useTheme_v2, Stack, Flex, Box, Text, Button, Dialog, Card, TextInput, Checkbox, Code, Inline, Spinner, Heading, MenuButton, Menu, MenuItem, Tooltip, useToast, TabList, Tab, TabPanel, Label as Label$1, Grid, useClickOutsideEvent, Popover, MenuDivider, Autocomplete, Radio, rem } from "@sanity/ui";
import React, { useState, useMemo, useCallback, useReducer, useId, memo, useRef, useEffect, createContext, useContext, isValidElement, PureComponent, createElement, forwardRef, Suspense } from "react";
import compact from "lodash/compact.js";
import toLower from "lodash/toLower.js";
import trim from "lodash/trim.js";
import uniq from "lodash/uniq.js";
import words from "lodash/words.js";
import { suspend, clear, preload } from "suspend-react";
import { defer, timer, of, Observable, concat, throwError, from, Subject } from "rxjs";
import { styled, css } from "styled-components";
import { uuid } from "@sanity/uuid";
import { expand, concatMap, tap, switchMap, mergeMap, catchError, mergeMapTo, takeUntil } from "rxjs/operators";
import MuxPlayer from "@mux/mux-player-react/lazy";
import { IntentLink } from "sanity/router";
import isNumber from "lodash/isNumber.js";
import isString from "lodash/isString.js";
import { useObservable } from "react-rx";
import useSWR from "swr";
import scrollIntoView from "scroll-into-view-if-needed";
import { UpChunk } from "@mux/upchunk";
import { isValidElementType } from "react-is";
import LanguagesList from "iso-639-1";
const ToolIcon = () => /* @__PURE__ */ jsx(
  "svg",
  {
    stroke: "currentColor",
    fill: "currentColor",
    strokeWidth: "0",
    viewBox: "0 0 24 24",
    height: "1em",
    width: "1em",
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ jsx("path", { d: "M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12zm-5-6l-7 4V7z" })
  }
), SANITY_API_VERSION = "2024-03-05";
function useClient() {
  return useClient$1({ apiVersion: SANITY_API_VERSION });
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
  const quotedQueries = [], unquotedQuery = query.replace(/("[^"]*")/g, (match) => words(match).length > 1 ? (quotedQueries.push(match), "") : match), quotedTerms = quotedQueries.map((str) => trim(toLower(str))), remainingTerms = uniq(compact(tokenize(toLower(unquotedQuery))));
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
}, useAssetDocuments = createHookFromObservableFactory(({ documentStore, sort, searchQuery }) => {
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
  const documentStore = useDocumentStore(), [sort, setSort] = useState("createdDesc"), [searchQuery, setSearchQuery] = useState(""), [assetDocuments = [], isLoading] = useAssetDocuments(
    useMemo(() => ({ documentStore, sort, searchQuery }), [documentStore, sort, searchQuery])
  );
  return {
    assets: useMemo(
      () => (
        // Avoid displaying both drafts & published assets by collating them together and giving preference to drafts
        collate(assetDocuments).map(
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
  return useState(!1);
}
function saveSecrets(client, token, secretKey, enableSignedUrls, signingKeyId, signingKeyPrivate) {
  const doc = {
    _id: "secrets.mux",
    _type: "mux.apiKey",
    token,
    secretKey,
    enableSignedUrls,
    signingKeyId,
    signingKeyPrivate
  };
  return client.createOrReplace(doc);
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
  return defer(
    () => client.observable.request({
      url: `/addons/mux/secrets/${dataset}/test`,
      withCredentials: !0,
      method: "GET"
    })
  );
}
const useSaveSecrets = (client, secrets) => useCallback(
  async ({
    token,
    secretKey,
    enableSignedUrls
  }) => {
    let { signingKeyId, signingKeyPrivate } = secrets;
    try {
      if (await saveSecrets(
        client,
        token,
        secretKey,
        enableSignedUrls,
        signingKeyId,
        signingKeyPrivate
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
          signingKeyPrivate
        );
      } catch (err) {
        throw console.log("Error while creating and saving signing key:", err?.message), err;
      }
    return {
      token,
      secretKey,
      enableSignedUrls,
      signingKeyId,
      signingKeyPrivate
    };
  },
  [client, secrets]
), name = "mux-input", cacheNs = "sanity-plugin-mux-input", muxSecretsDocumentId = "secrets.mux", DIALOGS_Z_INDEX = 6e4, THUMBNAIL_ASPECT_RATIO = 1.7777777777777777, MIN_ASPECT_RATIO = 5 / 4, AUDIO_ASPECT_RATIO = 5 / 1, path$1 = ["token", "secretKey", "enableSignedUrls", "signingKeyId", "signingKeyPrivate"], useSecretsDocumentValues = () => {
  const { error, isLoading, value } = useDocumentValues(
    muxSecretsDocumentId,
    path$1
  ), cache = useMemo(() => {
    const exists = !!value, secrets = {
      token: value?.token || null,
      secretKey: value?.secretKey || null,
      enableSignedUrls: value?.enableSignedUrls || !1,
      signingKeyId: value?.signingKeyId || null,
      signingKeyPrivate: value?.signingKeyPrivate || null
    };
    return {
      isInitialSetup: !exists,
      needsSetup: !secrets?.token || !secrets?.secretKey,
      secrets
    };
  }, [value]);
  return { error, isLoading, value: cache };
};
function init({ token, secretKey, enableSignedUrls }) {
  return {
    submitting: !1,
    error: null,
    // Form inputs don't set the state back to null when clearing a field, but uses empty strings
    // This ensures the `dirty` check works correctly
    token: token ?? "",
    secretKey: secretKey ?? "",
    enableSignedUrls: enableSignedUrls ?? !1
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
const useSecretsFormState = (secrets) => useReducer(reducer, secrets, init), _id = "secrets.mux";
function readSecrets(client) {
  const { projectId, dataset } = client.config();
  return suspend(async () => {
    const data = await client.fetch(
      /* groq */
      `*[_id == $_id][0]{
        token,
        secretKey,
        enableSignedUrls,
        signingKeyId,
        signingKeyPrivate
      }`,
      { _id }
    );
    return {
      token: data?.token || null,
      secretKey: data?.secretKey || null,
      enableSignedUrls: !!data?.enableSignedUrls || !1,
      signingKeyId: data?.signingKeyId || null,
      signingKeyPrivate: data?.signingKeyPrivate || null
    };
  }, [cacheNs, _id, projectId, dataset]);
}
function MuxLogo({ height = 26 }) {
  const id = useId(), fillColor = useTheme_v2().color._dark ? "white" : "black", titleId = useMemo(() => `${id}-title`, [id]), pathStyle = {
    fillRule: "nonzero"
  };
  return /* @__PURE__ */ jsx(
    "svg",
    {
      "aria-labelledby": titleId,
      style: { height: `${height}px` },
      viewBox: "0 0 1600 500",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      xmlSpace: "preserve",
      children: /* @__PURE__ */ jsxs("g", { id: "Layer-1", fill: fillColor, children: [
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M994.287,93.486c-17.121,-0 -31,-13.879 -31,-31c0,-17.121 13.879,-31 31,-31c17.121,-0 31,13.879 31,31c0,17.121 -13.879,31 -31,31m0,-93.486c-34.509,-0 -62.484,27.976 -62.484,62.486l0,187.511c0,68.943 -56.09,125.033 -125.032,125.033c-68.942,-0 -125.03,-56.09 -125.03,-125.033l0,-187.511c0,-34.51 -27.976,-62.486 -62.485,-62.486c-34.509,-0 -62.484,27.976 -62.484,62.486l0,187.511c0,137.853 112.149,250.003 249.999,250.003c137.851,-0 250.001,-112.15 250.001,-250.003l0,-187.511c0,-34.51 -27.976,-62.486 -62.485,-62.486",
            style: pathStyle
          }
        ),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M1537.51,468.511c-17.121,-0 -31,-13.879 -31,-31c0,-17.121 13.879,-31 31,-31c17.121,-0 31,13.879 31,31c0,17.121 -13.879,31 -31,31m-275.883,-218.509l-143.33,143.329c-24.402,24.402 -24.402,63.966 0,88.368c24.402,24.402 63.967,24.402 88.369,-0l143.33,-143.329l143.328,143.329c24.402,24.4 63.967,24.402 88.369,-0c24.403,-24.402 24.403,-63.966 0.001,-88.368l-143.33,-143.329l0.001,-0.004l143.329,-143.329c24.402,-24.402 24.402,-63.965 0,-88.367c-24.402,-24.402 -63.967,-24.402 -88.369,-0l-143.329,143.328l-143.329,-143.328c-24.402,-24.401 -63.967,-24.402 -88.369,-0c-24.402,24.402 -24.402,63.965 0,88.367l143.329,143.329l0,0.004Z",
            style: pathStyle
          }
        ),
        /* @__PURE__ */ jsx(
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
const Logo = styled.span`
  display: inline-block;
  height: 0.8em;
  margin-right: 1em;
  transform: translate(0.3em, -0.2em);
`, Header = () => /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx(Logo, { children: /* @__PURE__ */ jsx(MuxLogo, { height: 13 }) }),
  "API Credentials"
] });
function FormField(props) {
  const { children, title, description, inputId } = props;
  return /* @__PURE__ */ jsxs(Stack, { space: 1, children: [
    /* @__PURE__ */ jsx(Flex, { align: "flex-end", children: /* @__PURE__ */ jsx(Box, { flex: 1, paddingY: 2, children: /* @__PURE__ */ jsxs(Stack, { space: 2, children: [
      /* @__PURE__ */ jsx(Text, { as: "label", htmlFor: inputId, weight: "semibold", size: 1, children: title || /* @__PURE__ */ jsx("em", { children: "Untitled" }) }),
      description && /* @__PURE__ */ jsx(Text, { muted: !0, size: 1, children: description })
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { children })
  ] });
}
var FormField$1 = memo(FormField);
const fieldNames = ["token", "secretKey", "enableSignedUrls"];
function ConfigureApiDialog({ secrets, setDialogState }) {
  const client = useClient(), [state, dispatch] = useSecretsFormState(secrets), hasSecretsInitially = useMemo(() => secrets.token && secrets.secretKey, [secrets]), handleClose = useCallback(() => setDialogState(!1), [setDialogState]), dirty = useMemo(
    () => secrets.token !== state.token || secrets.secretKey !== state.secretKey || secrets.enableSignedUrls !== state.enableSignedUrls,
    [secrets, state]
  ), id = `ConfigureApi${useId()}`, [tokenId, secretKeyId, enableSignedUrlsId] = useMemo(
    () => fieldNames.map((field) => `${id}-${field}`),
    [id]
  ), firstField = useRef(null), handleSaveSecrets = useSaveSecrets(client, secrets), saving = useRef(!1), handleSubmit = useCallback(
    (event) => {
      if (event.preventDefault(), !saving.current && event.currentTarget.reportValidity()) {
        saving.current = !0, dispatch({ type: "submit" });
        const { token, secretKey, enableSignedUrls } = state;
        handleSaveSecrets({ token, secretKey, enableSignedUrls }).then((savedSecrets) => {
          const { projectId, dataset } = client.config();
          clear([cacheNs, _id, projectId, dataset]), preload(() => Promise.resolve(savedSecrets), [cacheNs, _id, projectId, dataset]), setDialogState(!1);
        }).catch((err) => dispatch({ type: "error", payload: err.message })).finally(() => {
          saving.current = !1;
        });
      }
    },
    [client, dispatch, handleSaveSecrets, setDialogState, state]
  ), handleChangeToken = useCallback(
    (event) => {
      dispatch({
        type: "change",
        payload: { name: "token", value: event.currentTarget.value }
      });
    },
    [dispatch]
  ), handleChangeSecretKey = useCallback(
    (event) => {
      dispatch({
        type: "change",
        payload: { name: "secretKey", value: event.currentTarget.value }
      });
    },
    [dispatch]
  ), handleChangeEnableSignedUrls = useCallback(
    (event) => {
      dispatch({
        type: "change",
        payload: { name: "enableSignedUrls", value: event.currentTarget.checked }
      });
    },
    [dispatch]
  );
  return useEffect(() => {
    firstField.current && firstField.current.focus();
  }, [firstField]), /* @__PURE__ */ jsx(
    Dialog,
    {
      animate: !0,
      id,
      onClose: handleClose,
      onClickOutside: handleClose,
      header: /* @__PURE__ */ jsx(Header, {}),
      zOffset: DIALOGS_Z_INDEX,
      position: "fixed",
      width: 1,
      children: /* @__PURE__ */ jsx(Box, { padding: 3, children: /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, noValidate: !0, children: /* @__PURE__ */ jsxs(Stack, { space: 4, children: [
        !hasSecretsInitially && /* @__PURE__ */ jsx(Card, { padding: [3, 3, 3], radius: 2, shadow: 1, tone: "primary", children: /* @__PURE__ */ jsxs(Stack, { space: 3, children: [
          /* @__PURE__ */ jsxs(Text, { size: 1, children: [
            "To set up a new access token, go to your",
            " ",
            /* @__PURE__ */ jsx(
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
          /* @__PURE__ */ jsxs(Text, { size: 1, children: [
            "The access token needs permissions: ",
            /* @__PURE__ */ jsx("strong", { children: "Mux Video " }),
            "(Full Access) and ",
            /* @__PURE__ */ jsx("strong", { children: "Mux Data" }),
            " (Read)",
            /* @__PURE__ */ jsx("br", {}),
            "To use Signed URLs, the token must also have System permissions.",
            /* @__PURE__ */ jsx("br", {}),
            "The credentials will be stored safely in a hidden document only available to editors."
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(FormField$1, { title: "Access Token", inputId: tokenId, children: /* @__PURE__ */ jsx(
          TextInput,
          {
            id: tokenId,
            ref: firstField,
            onChange: handleChangeToken,
            type: "text",
            value: state.token ?? "",
            required: !!state.secretKey || state.enableSignedUrls
          }
        ) }),
        /* @__PURE__ */ jsx(FormField$1, { title: "Secret Key", inputId: secretKeyId, children: /* @__PURE__ */ jsx(
          TextInput,
          {
            id: secretKeyId,
            onChange: handleChangeSecretKey,
            type: "text",
            value: state.secretKey ?? "",
            required: !!state.token || state.enableSignedUrls
          }
        ) }),
        /* @__PURE__ */ jsxs(Stack, { space: 4, children: [
          /* @__PURE__ */ jsxs(Flex, { align: "center", children: [
            /* @__PURE__ */ jsx(
              Checkbox,
              {
                id: enableSignedUrlsId,
                onChange: handleChangeEnableSignedUrls,
                checked: state.enableSignedUrls,
                style: { display: "block" }
              }
            ),
            /* @__PURE__ */ jsx(Box, { flex: 1, paddingLeft: 3, children: /* @__PURE__ */ jsx(Text, { children: /* @__PURE__ */ jsx("label", { htmlFor: enableSignedUrlsId, children: "Enable Signed Urls" }) }) })
          ] }),
          secrets.signingKeyId && state.enableSignedUrls ? /* @__PURE__ */ jsx(Card, { padding: [3, 3, 3], radius: 2, shadow: 1, tone: "caution", children: /* @__PURE__ */ jsxs(Stack, { space: 3, children: [
            /* @__PURE__ */ jsx(Text, { size: 1, children: "The signing key ID that Sanity will use is:" }),
            /* @__PURE__ */ jsx(Code, { size: 1, children: secrets.signingKeyId }),
            /* @__PURE__ */ jsxs(Text, { size: 1, children: [
              "This key is only used for previewing content in the Sanity UI.",
              /* @__PURE__ */ jsx("br", {}),
              "You should generate a different key to use in your application server."
            ] })
          ] }) }) : null
        ] }),
        /* @__PURE__ */ jsxs(Inline, { space: 2, children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              text: "Save",
              disabled: !dirty,
              loading: state.submitting,
              tone: "primary",
              mode: "default",
              type: "submit"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              disabled: state.submitting,
              text: "Cancel",
              mode: "bleed",
              onClick: handleClose
            }
          )
        ] }),
        state.error && /* @__PURE__ */ jsx(Card, { padding: [3, 3, 3], radius: 2, shadow: 1, tone: "critical", children: /* @__PURE__ */ jsx(Text, { children: state.error }) })
      ] }) }) })
    }
  );
}
function ConfigureApi() {
  const [dialogOpen, setDialogOpen] = useDialogState(), secretDocumentValues = useSecretsDocumentValues(), openDialog = useCallback(() => setDialogOpen("secrets"), [setDialogOpen]);
  return dialogOpen === "secrets" ? /* @__PURE__ */ jsx(
    ConfigureApiDialog,
    {
      secrets: secretDocumentValues.value.secrets,
      setDialogState: setDialogOpen
    }
  ) : /* @__PURE__ */ jsx(Button, { mode: "bleed", text: "Configure plugin", onClick: openDialog });
}
function generateAssetPlaceholder(assetId) {
  return `Asset #${truncateString(assetId, 15)}`;
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
  const [state, setState] = useState({ loading: !0, cursor: null });
  return useEffect(() => {
    if (!enabled) return;
    const subscription = defer(
      () => fetchMuxAssetsPage(
        client,
        // When we've already successfully loaded before (fully or partially), we start from the next cursor to avoid re-fetching
        "data" in state && state.data && state.data.length > 0 && !state.error ? state.cursor : null
      )
    ).pipe(
      // Here we use "expand" to recursively fetch next pages
      expand((pageResult) => hasMorePages(pageResult) ? timer(2e3).pipe(
        concatMap(
          () => (
            // eslint-disable-next-line max-nested-callbacks
            defer(
              () => fetchMuxAssetsPage(
                client,
                "next_cursor" in pageResult ? pageResult.next_cursor : null
              )
            )
          )
        )
      ) : of()),
      // On each iteration, persist intermediate states to give feedback to users
      tap(
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
  const documentStore = useDocumentStore(), client = useClient$1({
    apiVersion: SANITY_API_VERSION
  }), [assetsInSanity, assetsInSanityLoading] = useAssetsInSanity(documentStore), hasSecrets = !!useSecretsDocumentValues().value.secrets?.secretKey, [importError, setImportError] = useState(), [importState, setImportState] = useState("closed"), dialogOpen = importState !== "closed", muxAssets = useMuxAssets({
    client,
    enabled: hasSecrets && dialogOpen
  }), missingAssets = useMemo(() => assetsInSanity && muxAssets.data ? muxAssets.data.filter((a2) => !assetExistsInSanity(a2, assetsInSanity)) : void 0, [assetsInSanity, muxAssets.data]), [selectedAssets, setSelectedAssets] = useState([]), closeDialog = () => {
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
      _id: uuid(),
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
const useAssetsInSanity = createHookFromObservableFactory(
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
  const [inView, setInView] = useState(!1);
  return useEffect(() => {
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
function generateJwt(client, playbackId, aud, payload) {
  const { signingKeyId, signingKeyPrivate } = readSecrets(client);
  if (!signingKeyId)
    throw new TypeError("Missing `signingKeyId`.\n Check your plugin's configuration");
  if (!signingKeyPrivate)
    throw new TypeError("Missing `signingKeyPrivate`.\n Check your plugin's configuration");
  const { default: sign } = suspend(() => import("jsonwebtoken-esm/sign"), ["jsonwebtoken-esm/sign"]);
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
function getPlaybackId(asset) {
  if (!asset?.playbackId)
    throw console.error("Asset is missing a playbackId", { asset }), new TypeError("Missing playbackId");
  return asset.playbackId;
}
function getPlaybackPolicy(asset) {
  return asset.data?.playback_ids?.find((playbackId) => asset.playbackId === playbackId.id)?.policy ?? "public";
}
function createUrlParamsObject(client, asset, params, audience) {
  const playbackId = getPlaybackId(asset);
  let searchParams = new URLSearchParams(
    JSON.parse(JSON.stringify(params, (_, v) => v ?? void 0))
  );
  if (getPlaybackPolicy(asset) === "signed") {
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
const Image = styled.img`
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
  const ref = useRef(null), inView = useInView(ref), posterWidth = width || 250, [status, setStatus] = useState("loading"), client = useClient(), src = useMemo(() => {
    try {
      let thumbnail;
      return staticImage ? thumbnail = getPosterSrc({ asset, client, width: posterWidth }) : thumbnail = getAnimatedPosterSrc({ asset, client, width: posterWidth }), thumbnail;
    } catch {
      status !== "error" && setStatus("error");
      return;
    }
  }, [asset, client, posterWidth, status, staticImage]);
  function handleLoad() {
    setStatus("loaded");
  }
  function handleError() {
    setStatus("error");
  }
  return /* @__PURE__ */ jsx(
    Card,
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
      children: inView ? /* @__PURE__ */ jsxs(Fragment, { children: [
        status === "loading" && /* @__PURE__ */ jsx(
          Box,
          {
            style: {
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)"
            },
            children: /* @__PURE__ */ jsx(Spinner, {})
          }
        ),
        status === "error" && /* @__PURE__ */ jsxs(
          Stack,
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
              /* @__PURE__ */ jsx(Text, { size: 4, muted: !0, children: /* @__PURE__ */ jsx(ErrorOutlineIcon, { style: { fontSize: "1.75em" } }) }),
              /* @__PURE__ */ jsx(Text, { muted: !0, align: "center", children: "Failed loading thumbnail" })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          Image,
          {
            src,
            alt: `Preview for ${staticImage ? "image" : "video"} ${asset.filename || asset.assetId}`,
            onLoad: handleLoad,
            onError: handleError,
            style: { opacity: status === "loaded" ? 1 : 0 }
          }
        )
      ] }) : null
    }
  );
}
const MissingAssetCheckbox = styled(Checkbox)`
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
  const duration = useFormattedDuration(asset.duration * 1e3);
  return /* @__PURE__ */ jsx(
    Card,
    {
      tone: selected ? "positive" : void 0,
      border: !0,
      paddingX: 2,
      paddingY: 3,
      style: { position: "relative" },
      radius: 1,
      children: /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 2, children: [
        /* @__PURE__ */ jsx(
          MissingAssetCheckbox,
          {
            checked: selected,
            onChange: (e) => {
              selectAsset(e.currentTarget.checked);
            },
            "aria-label": selected ? `Import video ${asset.id}` : `Skip import of video ${asset.id}`
          }
        ),
        /* @__PURE__ */ jsx(
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
        /* @__PURE__ */ jsxs(Stack, { space: 2, children: [
          /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 1, children: [
            /* @__PURE__ */ jsx(Code, { size: 2, children: truncateString(asset.id, 15) }),
            " ",
            /* @__PURE__ */ jsxs(Text, { muted: !0, size: 2, children: [
              "(",
              duration.formatted,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Text, { size: 1, children: [
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
  return /* @__PURE__ */ jsx(
    Dialog,
    {
      animate: !0,
      header: "Import videos from Mux",
      zOffset: DIALOGS_Z_INDEX,
      id: "video-details-dialog",
      onClose: props.closeDialog,
      onClickOutside: props.closeDialog,
      width: 1,
      position: "fixed",
      footer: importState !== "done" && !noAssetsToImport && /* @__PURE__ */ jsx(Card, { padding: 3, children: /* @__PURE__ */ jsxs(Flex, { justify: "space-between", align: "center", children: [
        /* @__PURE__ */ jsx(
          Button,
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
        props.missingAssets && /* @__PURE__ */ jsx(
          Button,
          {
            icon: RetrieveIcon,
            fontSize: 2,
            padding: 3,
            mode: "ghost",
            text: props.selectedAssets?.length > 0 ? `Import ${props.selectedAssets.length} video(s)` : "No video(s) selected",
            tone: "positive",
            onClick: props.importAssets,
            iconRight: isImporting && Spinner,
            disabled: !canTriggerImport
          }
        )
      ] }) }),
      children: /* @__PURE__ */ jsxs(Box, { padding: 3, children: [
        props.muxAssets.hasSkippedAssetsWithoutPlayback && /* @__PURE__ */ jsx(Card, { tone: "caution", marginBottom: 5, padding: 3, border: !0, children: /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 2, children: [
          /* @__PURE__ */ jsx(InfoOutlineIcon, { fontSize: 36 }),
          /* @__PURE__ */ jsxs(Stack, { space: 2, children: [
            /* @__PURE__ */ jsx(Text, { size: 2, weight: "semibold", children: "Some videos were skipped" }),
            /* @__PURE__ */ jsx(Text, { size: 1, children: "Videos without playback IDs cannot be imported and have been excluded from the list." })
          ] })
        ] }) }),
        (props.muxAssets.loading || props.assetsInSanityLoading) && /* @__PURE__ */ jsx(Card, { tone: "primary", marginBottom: 5, padding: 3, border: !0, children: /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 4, children: [
          /* @__PURE__ */ jsx(Spinner, { muted: !0, size: 4 }),
          /* @__PURE__ */ jsxs(Stack, { space: 2, children: [
            /* @__PURE__ */ jsx(Text, { size: 2, weight: "semibold", children: "Loading assets from Mux" }),
            /* @__PURE__ */ jsxs(Text, { size: 1, children: [
              "This may take a while.",
              props.missingAssets && props.missingAssets.length > 0 && ` There are at least ${props.missingAssets.length} video${props.missingAssets.length > 1 ? "s" : ""} currently not in Sanity...`
            ] })
          ] })
        ] }) }),
        props.muxAssets.error && /* @__PURE__ */ jsx(Card, { tone: "critical", marginBottom: 5, padding: 3, border: !0, children: /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 2, children: [
          /* @__PURE__ */ jsx(ErrorOutlineIcon, { fontSize: 36 }),
          /* @__PURE__ */ jsxs(Stack, { space: 2, children: [
            /* @__PURE__ */ jsx(Text, { size: 2, weight: "semibold", children: "There was an error getting all data from Mux" }),
            /* @__PURE__ */ jsx(Text, { size: 1, children: props.missingAssets ? `But we've found ${props.missingAssets.length} video${props.missingAssets.length > 1 ? "s" : ""} not in Sanity, which you can start importing now.` : "Please try again or contact a developer for help." })
          ] })
        ] }) }),
        importState === "importing" && /* @__PURE__ */ jsx(Card, { tone: "primary", marginBottom: 5, padding: 3, border: !0, children: /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 4, children: [
          /* @__PURE__ */ jsx(Spinner, { muted: !0, size: 4 }),
          /* @__PURE__ */ jsx(Stack, { space: 2, children: /* @__PURE__ */ jsxs(Text, { size: 2, weight: "semibold", children: [
            "Importing ",
            props.selectedAssets.length,
            " video",
            props.selectedAssets.length > 1 && "s",
            " from Mux"
          ] }) })
        ] }) }),
        importState === "error" && /* @__PURE__ */ jsx(Card, { tone: "critical", marginBottom: 5, padding: 3, border: !0, children: /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 2, children: [
          /* @__PURE__ */ jsx(ErrorOutlineIcon, { fontSize: 36 }),
          /* @__PURE__ */ jsxs(Stack, { space: 2, children: [
            /* @__PURE__ */ jsx(Text, { size: 2, weight: "semibold", children: "There was an error importing videos" }),
            /* @__PURE__ */ jsx(Text, { size: 1, children: props.importError ? `Error: ${props.importError}` : "Please try again or contact a developer for help." }),
            /* @__PURE__ */ jsx(Box, { marginTop: 1, children: /* @__PURE__ */ jsx(
              Button,
              {
                icon: RetryIcon,
                text: "Retry",
                tone: "primary",
                onClick: props.importAssets
              }
            ) })
          ] })
        ] }) }),
        (noAssetsToImport || importState === "done") && /* @__PURE__ */ jsxs(Stack, { paddingY: 5, marginBottom: 4, space: 3, style: { textAlign: "center" }, children: [
          /* @__PURE__ */ jsx(Box, { children: /* @__PURE__ */ jsx(CheckmarkCircleIcon, { fontSize: 48 }) }),
          /* @__PURE__ */ jsx(Heading, { size: 2, children: importState === "done" ? "Videos imported successfully" : "There are no Mux videos to import" }),
          /* @__PURE__ */ jsx(Text, { size: 2, children: importState === "done" ? "You can now use them in your Sanity content." : "They're all in Sanity and ready to be used in your content." })
        ] }),
        props.missingAssets && props.missingAssets.length > 0 && (importState === "idle" || importState === "error") && /* @__PURE__ */ jsxs(Stack, { space: 4, children: [
          /* @__PURE__ */ jsxs(Heading, { size: 1, children: [
            "There are ",
            props.missingAssets.length,
            props.muxAssets.loading && "+",
            " Mux video",
            props.missingAssets.length > 1 && "s",
            " ",
            "not in Sanity"
          ] }),
          !props.muxAssets.loading && /* @__PURE__ */ jsxs(Flex, { align: "center", paddingX: 2, children: [
            /* @__PURE__ */ jsx(
              Checkbox,
              {
                id: "import-all",
                style: { display: "block" },
                onClick: (e) => {
                  e.currentTarget.checked ? props.missingAssets && props.setSelectedAssets(props.missingAssets) : props.setSelectedAssets([]);
                },
                checked: props.selectedAssets.length === props.missingAssets.length
              }
            ),
            /* @__PURE__ */ jsx(Box, { flex: 1, paddingLeft: 3, as: "label", htmlFor: "import-all", children: /* @__PURE__ */ jsx(Text, { children: "Import all" }) })
          ] }),
          props.missingAssets.map((asset) => /* @__PURE__ */ jsx(
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
    return importAssets.dialogOpen ? /* @__PURE__ */ jsx(ImportVideosDialog, { ...importAssets }) : /* @__PURE__ */ jsx(Button, { mode: "bleed", text: "Import from Mux", onClick: importAssets.openDialog });
}
function useResyncMuxMetadata() {
  const documentStore = useDocumentStore(), client = useClient$1({
    apiVersion: SANITY_API_VERSION
  }), [sanityAssets, sanityAssetsLoading] = useSanityAssets(documentStore), hasSecrets = !!useSecretsDocumentValues().value.secrets?.secretKey, [resyncError, setResyncError] = useState(), [resyncState, setResyncState] = useState("closed"), dialogOpen = resyncState !== "closed", muxAssets = useMuxAssets({
    client,
    enabled: hasSecrets && dialogOpen
  }), matchedAssets = useMemo(() => sanityAssets && muxAssets.data ? sanityAssets.map((sanityDoc) => {
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
  return {
    sanityAssetsLoading,
    closeDialog,
    dialogOpen,
    resyncState,
    resyncError,
    hasSecrets,
    syncAllVideos,
    syncOnlyEmpty,
    matchedAssets,
    muxAssets,
    openDialog
  };
}
const useSanityAssets = createHookFromObservableFactory(
  (documentStore) => documentStore.listenQuery(
    /* groq */
    '*[_type == "mux.videoAsset"]',
    {},
    {
      apiVersion: SANITY_API_VERSION
    }
  )
);
function ResyncMetadataDialog(props) {
  const { resyncState } = props, canTriggerResync = resyncState === "idle" || resyncState === "error", isResyncing = resyncState === "syncing", isDone = resyncState === "done", videosToUpdate = props.matchedAssets?.filter((m) => m.muxAsset).length || 0, videosWithEmptyOrPlaceholder = props.matchedAssets?.filter(
    (m) => m.muxAsset && m.muxTitle && isEmptyOrPlaceholderTitle(m.currentTitle, m.muxAsset.id)
  ).length || 0;
  return /* @__PURE__ */ jsx(
    Dialog,
    {
      animate: !0,
      header: "Resync Metadata from Mux",
      zOffset: DIALOGS_Z_INDEX,
      id: "resync-metadata-dialog",
      onClose: props.closeDialog,
      onClickOutside: props.closeDialog,
      width: 1,
      position: "fixed",
      footer: !isDone && /* @__PURE__ */ jsx(Card, { padding: 3, children: /* @__PURE__ */ jsxs(Flex, { justify: "space-between", align: "center", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            fontSize: 2,
            padding: 3,
            mode: "ghost",
            text: "Cancel",
            tone: "critical",
            onClick: props.closeDialog,
            disabled: isResyncing
          }
        ),
        /* @__PURE__ */ jsxs(Flex, { gap: 2, children: [
          videosWithEmptyOrPlaceholder > 0 && /* @__PURE__ */ jsx(
            Button,
            {
              fontSize: 2,
              padding: 3,
              mode: "ghost",
              text: `Update empty (${videosWithEmptyOrPlaceholder})`,
              tone: "caution",
              onClick: props.syncOnlyEmpty,
              disabled: isResyncing || !canTriggerResync
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              icon: SyncIcon,
              fontSize: 2,
              padding: 3,
              mode: "ghost",
              text: `Update all (${videosToUpdate})`,
              tone: "positive",
              onClick: props.syncAllVideos,
              iconRight: isResyncing && Spinner,
              disabled: !canTriggerResync
            }
          )
        ] })
      ] }) }),
      children: /* @__PURE__ */ jsxs(Box, { padding: 4, children: [
        (props.muxAssets.loading || props.sanityAssetsLoading) && /* @__PURE__ */ jsx(Card, { tone: "primary", marginBottom: 5, padding: 3, border: !0, children: /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 4, children: [
          /* @__PURE__ */ jsx(Spinner, { muted: !0, size: 4 }),
          /* @__PURE__ */ jsxs(Stack, { space: 2, children: [
            /* @__PURE__ */ jsx(Text, { size: 2, weight: "semibold", children: "Loading assets from Mux" }),
            /* @__PURE__ */ jsx(Text, { size: 1, children: "This may take a while." })
          ] })
        ] }) }),
        props.muxAssets.error && /* @__PURE__ */ jsx(Card, { tone: "critical", marginBottom: 5, padding: 3, border: !0, children: /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 2, children: [
          /* @__PURE__ */ jsx(ErrorOutlineIcon, { fontSize: 36 }),
          /* @__PURE__ */ jsxs(Stack, { space: 2, children: [
            /* @__PURE__ */ jsx(Text, { size: 2, weight: "semibold", children: "There was an error getting data from Mux" }),
            /* @__PURE__ */ jsx(Text, { size: 1, children: "Please try again or contact a developer for help." })
          ] })
        ] }) }),
        resyncState === "syncing" && /* @__PURE__ */ jsx(Card, { tone: "primary", marginBottom: 5, padding: 3, border: !0, children: /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 4, children: [
          /* @__PURE__ */ jsx(Spinner, { muted: !0, size: 4 }),
          /* @__PURE__ */ jsxs(Stack, { space: 2, children: [
            /* @__PURE__ */ jsx(Text, { size: 2, weight: "semibold", children: "Updating video metadata" }),
            /* @__PURE__ */ jsx(Text, { size: 1, children: "Syncing titles from Mux..." })
          ] })
        ] }) }),
        resyncState === "error" && /* @__PURE__ */ jsx(Card, { tone: "critical", marginBottom: 5, padding: 3, border: !0, children: /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 2, children: [
          /* @__PURE__ */ jsx(ErrorOutlineIcon, { fontSize: 36 }),
          /* @__PURE__ */ jsxs(Stack, { space: 2, children: [
            /* @__PURE__ */ jsx(Text, { size: 2, weight: "semibold", children: "There was an error syncing metadata" }),
            /* @__PURE__ */ jsx(Text, { size: 1, children: props.resyncError ? `Error: ${props.resyncError}` : "Please try again or contact a developer for help." })
          ] })
        ] }) }),
        resyncState === "done" && /* @__PURE__ */ jsxs(Stack, { paddingY: 5, marginBottom: 4, space: 3, style: { textAlign: "center" }, children: [
          /* @__PURE__ */ jsx(Box, { children: /* @__PURE__ */ jsx(CheckmarkCircleIcon, { fontSize: 48 }) }),
          /* @__PURE__ */ jsx(Heading, { size: 2, children: "Metadata synced successfully" }),
          /* @__PURE__ */ jsx(Text, { size: 2, children: "All video titles have been updated from Mux." })
        ] }),
        resyncState === "idle" && !props.muxAssets.loading && !props.sanityAssetsLoading && /* @__PURE__ */ jsxs(Stack, { space: 4, children: [
          /* @__PURE__ */ jsxs(Heading, { size: 1, children: [
            "There ",
            videosToUpdate === 1 ? "is" : "are",
            " ",
            videosToUpdate,
            " video",
            videosToUpdate === 1 ? "" : "s",
            " with Mux metadata"
          ] }),
          /* @__PURE__ */ jsx(Text, { size: 2, children: "This will update video titles in Sanity to match those in Mux. No new videos will be created." }),
          videosWithEmptyOrPlaceholder > 0 && /* @__PURE__ */ jsx(Card, { padding: 3, tone: "caution", border: !0, children: /* @__PURE__ */ jsxs(Flex, { align: "flex-start", gap: 2, children: [
            /* @__PURE__ */ jsx(Box, { children: /* @__PURE__ */ jsx(ErrorOutlineIcon, {}) }),
            /* @__PURE__ */ jsxs(Stack, { space: 2, children: [
              /* @__PURE__ */ jsx(Text, { size: 2, weight: "semibold", children: "Videos with empty or placeholder titles" }),
              /* @__PURE__ */ jsxs(Text, { size: 1, muted: !0, children: [
                videosWithEmptyOrPlaceholder,
                " video",
                videosWithEmptyOrPlaceholder === 1 ? "" : "s",
                ' without titles or with placeholder titles (e.g., "Asset #123") can be updated selectively.'
              ] })
            ] })
          ] }) })
        ] })
      ] })
    }
  );
}
function ResyncMetadata() {
  const resyncMetadata = useResyncMuxMetadata();
  if (resyncMetadata.hasSecrets)
    return resyncMetadata.dialogOpen ? /* @__PURE__ */ jsx(ResyncMetadataDialog, { ...resyncMetadata }) : /* @__PURE__ */ jsx(Button, { mode: "bleed", text: "Resync Metadata", onClick: resyncMetadata.openDialog });
}
const CONTEXT_MENU_POPOVER_PROPS = {
  constrainSize: !0,
  placement: "bottom",
  portal: !0,
  width: 0
};
function SelectSortOptions(props) {
  const id = useId();
  return /* @__PURE__ */ jsx(
    MenuButton,
    {
      button: /* @__PURE__ */ jsx(Button, { text: "Sort", icon: SortIcon, mode: "bleed", padding: 3, style: { cursor: "pointer" } }),
      id,
      menu: /* @__PURE__ */ jsx(Menu, { children: Object.entries(ASSET_SORT_OPTIONS).map(([type, { label }]) => /* @__PURE__ */ jsx(
        MenuItem,
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
const SpinnerBox = () => /* @__PURE__ */ jsx(
  Box,
  {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "150px"
    },
    children: /* @__PURE__ */ jsx(Spinner, {})
  }
), IconInfo = (props) => {
  const Icon = props.icon;
  return /* @__PURE__ */ jsxs(Flex, { gap: 2, align: "center", padding: 1, children: [
    /* @__PURE__ */ jsx(Text, { size: (props.size || 1) + 1, muted: !0, children: /* @__PURE__ */ jsx(Icon, {}) }),
    /* @__PURE__ */ jsx(Text, { size: props.size || 1, muted: props.muted, children: props.text })
  ] });
};
function ResolutionIcon(props) {
  return /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "1em", height: "1em", viewBox: "0 0 24 24", ...props, children: /* @__PURE__ */ jsx(
    "path",
    {
      fill: "currentColor",
      d: "M20 9V6h-3V4h5v5h-2ZM2 9V4h5v2H4v3H2Zm15 11v-2h3v-3h2v5h-5ZM2 20v-5h2v3h3v2H2Zm4-4V8h12v8H6Zm2-2h8v-4H8v4Zm0 0v-4v4Z"
    }
  ) });
}
function StopWatchIcon(props) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "1em",
      height: "1em",
      viewBox: "0 0 512 512",
      ...props,
      children: [
        /* @__PURE__ */ jsx("path", { d: "M232 306.667h48V176h-48v130.667z", fill: "currentColor" }),
        /* @__PURE__ */ jsx(
          "path",
          {
            d: "M407.67 170.271l30.786-30.786-33.942-33.941-30.785 30.786C341.217 111.057 300.369 96 256 96 149.961 96 64 181.961 64 288s85.961 192 192 192 192-85.961 192-192c0-44.369-15.057-85.217-40.33-117.729zm-45.604 223.795C333.734 422.398 296.066 438 256 438s-77.735-15.602-106.066-43.934C121.602 365.735 106 328.066 106 288s15.602-77.735 43.934-106.066C178.265 153.602 215.934 138 256 138s77.734 15.602 106.066 43.934C390.398 210.265 406 247.934 406 288s-15.602 77.735-43.934 106.066z",
            fill: "currentColor"
          }
        ),
        /* @__PURE__ */ jsx("path", { d: "M192 32h128v48H192z", fill: "currentColor" })
      ]
    }
  );
}
const DialogStateContext = createContext({
  dialogState: !1,
  setDialogState: () => null
}), DialogStateProvider = ({
  dialogState,
  setDialogState,
  children
}) => /* @__PURE__ */ jsx(DialogStateContext.Provider, { value: { dialogState, setDialogState }, children }), useDialogStateContext = () => useContext(DialogStateContext);
function getVideoSrc({ asset, client }) {
  const playbackId = getPlaybackId(asset), searchParams = new URLSearchParams();
  if (getPlaybackPolicy(asset) === "signed") {
    const token = generateJwt(client, playbackId, "v");
    searchParams.set("token", token);
  }
  return `https://stream.mux.com/${playbackId}.m3u8?${searchParams}`;
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
  const client = useClient(), { setDialogState } = useDialogStateContext(), dialogId = `EditThumbnailDialog${useId()}`, [timeFormatted, setTimeFormatted] = useState(
    () => formatSecondsToHHMMSS(currentTime)
  ), [nextTime, setNextTime] = useState(currentTime), [inputError, setInputError] = useState(""), assetWithNewThumbnail = useMemo(() => ({ ...asset, thumbTime: nextTime }), [asset, nextTime]), [saving, setSaving] = useState(!1), [saveThumbnailError, setSaveThumbnailError] = useState(null), handleSave = () => {
    setSaving(!0), client.patch(asset._id).set({ thumbTime: nextTime }).commit({ returnDocuments: !1 }).then(() => void setDialogState(!1)).catch(setSaveThumbnailError).finally(() => void setSaving(!1));
  }, width = 300 * getDevicePixelRatio({ maxDpr: 2 });
  if (saveThumbnailError)
    throw saveThumbnailError;
  return /* @__PURE__ */ jsx(
    Dialog,
    {
      id: dialogId,
      header: "Edit thumbnail",
      onClose: () => setDialogState(!1),
      footer: /* @__PURE__ */ jsx(Stack, { padding: 3, children: /* @__PURE__ */ jsx(
        Button,
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
      children: /* @__PURE__ */ jsxs(Stack, { space: 3, padding: 3, children: [
        /* @__PURE__ */ jsxs(Stack, { space: 2, children: [
          /* @__PURE__ */ jsx(Text, { size: 1, weight: "semibold", children: "Current:" }),
          /* @__PURE__ */ jsx(VideoThumbnail, { asset, width, staticImage: !0 })
        ] }),
        /* @__PURE__ */ jsxs(Stack, { space: 2, children: [
          /* @__PURE__ */ jsx(Text, { size: 1, weight: "semibold", children: "New:" }),
          /* @__PURE__ */ jsx(VideoThumbnail, { asset: assetWithNewThumbnail, width, staticImage: !0 })
        ] }),
        /* @__PURE__ */ jsx(Stack, { space: 2, children: /* @__PURE__ */ jsx(Flex, { align: "center", justify: "center", children: /* @__PURE__ */ jsx(Text, { size: 5, weight: "semibold", children: "Or" }) }) }),
        /* @__PURE__ */ jsxs(Stack, { space: 2, children: [
          /* @__PURE__ */ jsx(Text, { size: 1, weight: "semibold", children: "Selected time for thumbnail (hh:mm:ss):" }),
          /* @__PURE__ */ jsx(
            TextInput,
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
  return /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "1em", height: "1em", viewBox: "0 0 24 24", ...props, children: /* @__PURE__ */ jsx(
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
  ...props
}) {
  const client = useClient(), { dialogState } = useDialogStateContext(), isAudio = assetIsAudio(asset), muxPlayer = useRef(null), {
    src: videoSrc,
    thumbnail: thumbnailSrc,
    error
  } = useMemo(() => {
    try {
      const thumbnail = getPosterSrc({ asset, client, width: thumbnailWidth }), src = asset?.playbackId && getVideoSrc({ client, asset });
      return src ? { src, thumbnail } : { error: new TypeError("Asset has no playback ID") };
    } catch (error2) {
      return { error: error2 };
    }
  }, [asset, client, thumbnailWidth]), signedToken = useMemo(() => {
    try {
      return new URL(videoSrc).searchParams.get("token");
    } catch {
      return !1;
    }
  }, [videoSrc]), [width, height] = (asset?.data?.aspect_ratio ?? "16:9").split(":").map(Number), targetAspectRatio = props.forceAspectRatio || (Number.isNaN(width) ? 16 / 9 : width / height);
  let aspectRatio = Math.max(MIN_ASPECT_RATIO, targetAspectRatio);
  return isAudio && (aspectRatio = props.forceAspectRatio ? (
    // Make it wider when forcing aspect ratio to balance with videos' rendering height (audio players overflow a bit)
    props.forceAspectRatio * 1.2
  ) : AUDIO_ASPECT_RATIO), /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      Card,
      {
        tone: "transparent",
        style: {
          aspectRatio,
          position: "relative",
          ...isAudio && { display: "flex", alignItems: "flex-end" }
        },
        children: [
          videoSrc && /* @__PURE__ */ jsxs(Fragment, { children: [
            isAudio && /* @__PURE__ */ jsx(
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
            /* @__PURE__ */ jsx(
              MuxPlayer,
              {
                poster: isAudio ? void 0 : thumbnailSrc,
                ref: muxPlayer,
                ...props,
                playsInline: !0,
                playbackId: asset.playbackId,
                tokens: signedToken ? { playback: signedToken, thumbnail: signedToken, storyboard: signedToken } : void 0,
                preload: "metadata",
                crossOrigin: "anonymous",
                metadata: {
                  player_name: "Sanity Admin Dashboard",
                  player_version: "2.12.1",
                  page_type: "Preview Player"
                },
                audio: isAudio,
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
          ] }),
          error ? /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
              },
              children: /* @__PURE__ */ jsxs(Text, { muted: !0, children: [
                /* @__PURE__ */ jsx(ErrorOutlineIcon, { style: { marginRight: "0.15em" } }),
                typeof error == "object" && "message" in error && typeof error.message == "string" ? error.message : "Error loading video"
              ] })
            }
          ) : null,
          children
        ]
      }
    ),
    dialogState === "edit-thumbnail" && /* @__PURE__ */ jsx(EditThumbnailDialog, { asset, currentTime: muxPlayer?.current?.currentTime })
  ] });
}
function assetIsAudio(asset) {
  return asset.data?.max_stored_resolution === "Audio only";
}
const getUnknownTypeFallback = (id, typeName) => ({
  title: /* @__PURE__ */ jsxs("em", { children: [
    "No schema found for type ",
    /* @__PURE__ */ jsx("code", { children: typeName })
  ] }),
  subtitle: /* @__PURE__ */ jsxs("em", { children: [
    "Document: ",
    /* @__PURE__ */ jsx("code", { children: id })
  ] }),
  media: () => /* @__PURE__ */ jsx(WarningOutlineIcon, {})
});
function MissingSchemaType(props) {
  const { layout, value } = props;
  return /* @__PURE__ */ jsx(SanityDefaultPreview, { ...getUnknownTypeFallback(value._id, value._type), layout });
}
function TimeAgo({ time }) {
  const timeAgo = useTimeAgo(time);
  return /* @__PURE__ */ jsxs("span", { title: timeAgo, children: [
    timeAgo,
    " ago"
  ] });
}
function DraftStatus(props) {
  const { document: document2 } = props, updatedAt = document2 && "_updatedAt" in document2 && document2._updatedAt;
  return /* @__PURE__ */ jsx(
    Tooltip,
    {
      animate: !0,
      portal: !0,
      content: /* @__PURE__ */ jsx(Box, { padding: 2, children: /* @__PURE__ */ jsx(Text, { size: 1, children: document2 ? /* @__PURE__ */ jsxs(Fragment, { children: [
        "Edited ",
        updatedAt && /* @__PURE__ */ jsx(TimeAgo, { time: updatedAt })
      ] }) : /* @__PURE__ */ jsx(Fragment, { children: "No unpublished edits" }) }) }),
      children: /* @__PURE__ */ jsx(TextWithTone, { tone: "caution", dimmed: !document2, muted: !document2, size: 1, children: /* @__PURE__ */ jsx(EditIcon, {}) })
    }
  );
}
function PublishedStatus(props) {
  const { document: document2 } = props, updatedAt = document2 && "_updatedAt" in document2 && document2._updatedAt;
  return /* @__PURE__ */ jsx(
    Tooltip,
    {
      animate: !0,
      portal: !0,
      content: /* @__PURE__ */ jsx(Box, { padding: 2, children: /* @__PURE__ */ jsx(Text, { size: 1, children: document2 ? /* @__PURE__ */ jsxs(Fragment, { children: [
        "Published ",
        updatedAt && /* @__PURE__ */ jsx(TimeAgo, { time: updatedAt })
      ] }) : /* @__PURE__ */ jsx(Fragment, { children: "Not published" }) }) }),
      children: /* @__PURE__ */ jsx(TextWithTone, { tone: "positive", dimmed: !document2, muted: !document2, size: 1, children: /* @__PURE__ */ jsx(PublishIcon, {}) })
    }
  );
}
function PaneItemPreview(props) {
  const { icon, layout, presence, schemaType, value } = props, title = isRecord(value.title) && isValidElement(value.title) || isString(value.title) || isNumber(value.title) ? value.title : null, observable = useMemo(
    () => getPreviewStateObservable(props.documentPreviewStore, schemaType, value._id),
    [props.documentPreviewStore, schemaType, value._id]
  ), { snapshot, original, isLoading } = useObservable(observable, {
    isLoading: !0,
    snapshot: null,
    original: null
  }), status = isLoading ? null : /* @__PURE__ */ jsxs(Inline, { space: 4, children: [
    presence && presence.length > 0 && /* @__PURE__ */ jsx(DocumentPreviewPresence, { presence }),
    /* @__PURE__ */ jsx(PublishedStatus, { document: original }),
    /* @__PURE__ */ jsx(DraftStatus, { document: snapshot })
  ] });
  return /* @__PURE__ */ jsx(
    SanityDefaultPreview,
    {
      ...getPreviewValueWithFallback({ snapshot, original, fallback: { title } }),
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
  return (linkProps) => /* @__PURE__ */ jsx(IntentLink, { intent: "edit", params: { id: props.documentPair.id }, children: linkProps.children });
}
function DocumentPreview(props) {
  const { schemaType, documentPair } = props, doc = documentPair?.draft || documentPair?.published, id = documentPair.id || "", documentPreviewStore = useDocumentPreviewStore(), schema = useSchema(), documentPresence = useDocumentPresence(id), hasSchemaType = !!(schemaType && schemaType.name && schema.get(schemaType.name)), PreviewComponent = useMemo(() => doc ? !schemaType || !hasSchemaType ? /* @__PURE__ */ jsx(MissingSchemaType, { value: doc }) : /* @__PURE__ */ jsx(
    PaneItemPreview,
    {
      documentPreviewStore,
      icon: getIconWithFallback(void 0, schemaType, DocumentIcon),
      schemaType,
      layout: "default",
      value: doc,
      presence: documentPresence
    }
  ) : null, [hasSchemaType, schemaType, documentPresence, doc, documentPreviewStore]);
  return /* @__PURE__ */ jsx(
    PreviewCard,
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
const Container = styled(Box)`
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
  const schema = useSchema();
  if (!props.isLoaded)
    return /* @__PURE__ */ jsx(SpinnerBox, {});
  if (!props.references?.length)
    return /* @__PURE__ */ jsx(Card, { border: !0, radius: 3, padding: 3, children: /* @__PURE__ */ jsx(Text, { size: 2, children: "No documents are using this video" }) });
  const documentPairs = collate(props.references || []);
  return /* @__PURE__ */ jsx(Container, { children: documentPairs?.map((documentPair) => {
    const schemaType = schema.get(documentPair.type);
    return /* @__PURE__ */ jsx(
      Card,
      {
        marginBottom: 2,
        padding: 2,
        radius: 2,
        shadow: 1,
        style: { overflow: "hidden" },
        children: /* @__PURE__ */ jsx(Box, { children: /* @__PURE__ */ jsx(DocumentPreview, { documentPair, schemaType }) })
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
  const client = useClient(), [state, setState] = useState("checkingReferences"), [deleteOnMux, setDeleteOnMux] = useState(!0), toast = useToast();
  useEffect(() => {
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
  return /* @__PURE__ */ jsx(
    Dialog,
    {
      animate: !0,
      header: "Delete video",
      zOffset: DIALOGS_Z_INDEX,
      id: "deleting-video-details-dialog",
      onClose: cancelDelete,
      onClickOutside: cancelDelete,
      width: 1,
      position: "fixed",
      children: /* @__PURE__ */ jsx(
        Card,
        {
          padding: 3,
          style: {
            minHeight: "150px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          },
          children: /* @__PURE__ */ jsxs(Stack, { space: 3, children: [
            state === "checkingReferences" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Heading, { size: 2, children: "Checking if video can be deleted" }),
              /* @__PURE__ */ jsx(SpinnerBox, {})
            ] }),
            state === "cantDelete" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Heading, { size: 2, children: "Video can't be deleted" }),
              /* @__PURE__ */ jsxs(Text, { size: 2, style: { marginBottom: "2rem" }, children: [
                "There are ",
                references?.length,
                " document",
                references && references.length > 0 && "s",
                " ",
                "pointing to this video. Remove their references to this file or delete them before proceeding."
              ] }),
              /* @__PURE__ */ jsx(VideoReferences, { references, isLoaded: !referencesLoading })
            ] }),
            state === "confirm" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Heading, { size: 2, children: "Are you sure you want to delete this video?" }),
              /* @__PURE__ */ jsx(Text, { size: 2, children: "This action is irreversible" }),
              /* @__PURE__ */ jsxs(Stack, { space: 4, marginY: 4, children: [
                /* @__PURE__ */ jsxs(Flex, { align: "center", as: "label", children: [
                  /* @__PURE__ */ jsx(
                    Checkbox,
                    {
                      checked: deleteOnMux,
                      onChange: () => setDeleteOnMux((prev) => !prev)
                    }
                  ),
                  /* @__PURE__ */ jsx(Text, { style: { margin: "0 10px" }, children: "Delete asset on Mux" })
                ] }),
                /* @__PURE__ */ jsxs(Flex, { align: "center", as: "label", children: [
                  /* @__PURE__ */ jsx(Checkbox, { disabled: !0, checked: !0 }),
                  /* @__PURE__ */ jsx(Text, { style: { margin: "0 10px" }, children: "Delete video from dataset" })
                ] }),
                /* @__PURE__ */ jsx(Box, { children: /* @__PURE__ */ jsx(
                  Button,
                  {
                    icon: TrashIcon,
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
            state === "processing_deletion" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Heading, { size: 2, children: "Deleting video..." }),
              /* @__PURE__ */ jsx(SpinnerBox, {})
            ] }),
            state === "error_deleting" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Heading, { size: 2, children: "Something went wrong!" }),
              /* @__PURE__ */ jsx(Text, { size: 2, children: "Try deleting the video again by clicking the button below" })
            ] })
          ] })
        }
      )
    }
  );
}
const useDocReferences = createHookFromObservableFactory(({ documentStore, id }) => documentStore.listenQuery(
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
    aspect_ratio: doc.data?.aspect_ratio,
    max_stored_resolution: doc.data?.max_stored_resolution,
    max_stored_frame_rate: doc.data?.max_stored_frame_rate
  };
}
function useVideoDetails(props) {
  const documentStore = useDocumentStore(), toast = useToast(), client = useClient(), [references, referencesLoading] = useDocReferences(
    useMemo(() => ({ documentStore, id: props.asset._id }), [documentStore, props.asset._id])
  ), [originalAsset, setOriginalAsset] = useState(() => props.asset), [filename, setFilename] = useState(props.asset.filename), modified = filename !== originalAsset.filename, displayInfo = getVideoMetadata({ ...props.asset, filename }), [state, setState] = useState("idle");
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
    saveChanges
  };
}
const AssetInput = (props) => /* @__PURE__ */ jsx(FormField$1, { title: props.label, description: props.description, inputId: props.label, children: /* @__PURE__ */ jsx(
  TextInput,
  {
    id: props.label,
    value: props.value,
    placeholder: props.placeholder,
    onInput: props.onInput,
    disabled: props.disabled
  }
) }), VideoDetails = (props) => {
  const [tab, setTab] = useState("details"), {
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
    saveChanges
  } = useVideoDetails(props), isSaving = state === "saving", [containerHeight, setContainerHeight] = useState(null), contentsRef = React.useRef(null);
  return useEffect(() => {
    !contentsRef.current || !("getBoundingClientRect" in contentsRef.current) || setContainerHeight(contentsRef.current.getBoundingClientRect().height);
  }, []), /* @__PURE__ */ jsxs(
    Dialog,
    {
      animate: !0,
      header: displayInfo.title,
      zOffset: DIALOGS_Z_INDEX,
      id: "video-details-dialog",
      onClose: handleClose,
      onClickOutside: handleClose,
      width: 2,
      position: "fixed",
      footer: /* @__PURE__ */ jsx(Card, { padding: 3, children: /* @__PURE__ */ jsxs(Flex, { justify: "space-between", align: "center", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            icon: TrashIcon,
            fontSize: 2,
            padding: 3,
            mode: "bleed",
            text: "Delete",
            tone: "critical",
            onClick: () => setState("deleting"),
            disabled: isSaving
          }
        ),
        modified && /* @__PURE__ */ jsx(
          Button,
          {
            icon: CheckmarkIcon,
            fontSize: 2,
            padding: 3,
            mode: "ghost",
            text: "Save and close",
            tone: "positive",
            onClick: saveChanges,
            iconRight: isSaving && Spinner,
            disabled: isSaving
          }
        )
      ] }) }),
      children: [
        state === "deleting" && /* @__PURE__ */ jsx(
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
        state === "closing" && /* @__PURE__ */ jsx(
          Dialog,
          {
            animate: !0,
            header: "You have unsaved changes",
            zOffset: DIALOGS_Z_INDEX,
            id: "closing-video-details-dialog",
            onClose: () => confirmClose(!1),
            onClickOutside: () => confirmClose(!1),
            width: 1,
            position: "fixed",
            footer: /* @__PURE__ */ jsx(Card, { padding: 3, children: /* @__PURE__ */ jsxs(Flex, { justify: "space-between", align: "center", children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  icon: ErrorOutlineIcon,
                  fontSize: 2,
                  padding: 3,
                  text: "Discard changes",
                  tone: "critical",
                  onClick: () => confirmClose(!0)
                }
              ),
              modified && /* @__PURE__ */ jsx(
                Button,
                {
                  icon: RevertIcon,
                  fontSize: 2,
                  padding: 3,
                  mode: "ghost",
                  text: "Keep editing",
                  tone: "primary",
                  onClick: () => confirmClose(!1)
                }
              )
            ] }) }),
            children: /* @__PURE__ */ jsx(Card, { padding: 5, children: /* @__PURE__ */ jsxs(Stack, { style: { textAlign: "center" }, space: 3, children: [
              /* @__PURE__ */ jsx(Heading, { size: 2, children: "Unsaved changes will be lost" }),
              /* @__PURE__ */ jsx(Text, { size: 2, children: "Are you sure you want to discard them?" })
            ] }) })
          }
        ),
        /* @__PURE__ */ jsx(
          Card,
          {
            padding: 4,
            sizing: "border",
            style: {
              containerType: "inline-size"
            },
            children: /* @__PURE__ */ jsxs(
              Flex,
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
                  /* @__PURE__ */ jsx(Stack, { space: 4, flex: 1, sizing: "border", children: /* @__PURE__ */ jsx(VideoPlayer, { asset: props.asset, autoPlay: props.asset.autoPlay || !1 }) }),
                  /* @__PURE__ */ jsxs(Stack, { space: 4, flex: 1, sizing: "border", children: [
                    /* @__PURE__ */ jsxs(TabList, { space: 2, children: [
                      /* @__PURE__ */ jsx(
                        Tab,
                        {
                          "aria-controls": "details-panel",
                          icon: EditIcon,
                          id: "details-tab",
                          label: "Details",
                          onClick: () => setTab("details"),
                          selected: tab === "details"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Tab,
                        {
                          "aria-controls": "references-panel",
                          icon: SearchIcon,
                          id: "references-tab",
                          label: `Used by ${references ? `(${references.length})` : ""}`,
                          onClick: () => setTab("references"),
                          selected: tab === "references"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx(
                      TabPanel,
                      {
                        "aria-labelledby": "details-tab",
                        id: "details-panel",
                        hidden: tab !== "details",
                        style: { wordBreak: "break-word" },
                        children: /* @__PURE__ */ jsxs(Stack, { space: 4, children: [
                          /* @__PURE__ */ jsx(
                            AssetInput,
                            {
                              label: "Video title or file name",
                              description: "Not visible to users. Useful for finding videos later.",
                              value: filename || "",
                              onInput: (e) => setFilename(e.currentTarget.value),
                              disabled: state !== "idle"
                            }
                          ),
                          /* @__PURE__ */ jsxs(Stack, { space: 3, children: [
                            displayInfo?.duration && /* @__PURE__ */ jsx(
                              IconInfo,
                              {
                                text: `Duration: ${displayInfo.duration}`,
                                icon: ClockIcon,
                                size: 2
                              }
                            ),
                            displayInfo?.max_stored_resolution && /* @__PURE__ */ jsx(
                              IconInfo,
                              {
                                text: `Max Resolution: ${displayInfo.max_stored_resolution}`,
                                icon: ResolutionIcon,
                                size: 2
                              }
                            ),
                            displayInfo?.max_stored_frame_rate && /* @__PURE__ */ jsx(
                              IconInfo,
                              {
                                text: `Frame rate: ${displayInfo.max_stored_frame_rate}`,
                                icon: StopWatchIcon,
                                size: 2
                              }
                            ),
                            displayInfo?.aspect_ratio && /* @__PURE__ */ jsx(
                              IconInfo,
                              {
                                text: `Aspect Ratio: ${displayInfo.aspect_ratio}`,
                                icon: CropIcon,
                                size: 2
                              }
                            ),
                            /* @__PURE__ */ jsx(
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
                                icon: CalendarIcon,
                                size: 2
                              }
                            ),
                            /* @__PURE__ */ jsx(IconInfo, { text: `Mux ID: 
${displayInfo.id}`, icon: TagIcon, size: 2 }),
                            displayInfo?.playbackId && /* @__PURE__ */ jsx(
                              IconInfo,
                              {
                                text: `Playback ID: ${displayInfo.playbackId}`,
                                icon: TagIcon,
                                size: 2
                              }
                            )
                          ] })
                        ] })
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      TabPanel,
                      {
                        "aria-labelledby": "references-tab",
                        id: "references-panel",
                        hidden: tab !== "references",
                        children: /* @__PURE__ */ jsx(VideoReferences, { references, isLoaded: !referencesLoading })
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
}, VideoMetadata = (props) => {
  if (!props.asset)
    return null;
  const displayInfo = getVideoMetadata(props.asset);
  return /* @__PURE__ */ jsxs(Stack, { space: 2, children: [
    displayInfo.title && /* @__PURE__ */ jsx(
      Text,
      {
        size: 1,
        weight: "semibold",
        style: {
          wordWrap: "break-word"
        },
        children: displayInfo.title
      }
    ),
    /* @__PURE__ */ jsxs(Inline, { space: 3, children: [
      displayInfo?.duration && /* @__PURE__ */ jsx(IconInfo, { text: displayInfo.duration, icon: ClockIcon, size: 1, muted: !0 }),
      /* @__PURE__ */ jsx(
        IconInfo,
        {
          text: displayInfo.createdAt.toISOString().split("T")[0],
          icon: CalendarIcon,
          size: 1,
          muted: !0
        }
      ),
      displayInfo.title != displayInfo.id.slice(0, 12) && /* @__PURE__ */ jsx(IconInfo, { text: displayInfo.id.slice(0, 12), icon: TagIcon, size: 1, muted: !0 })
    ] })
  ] });
}, PlayButton = styled.button`
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
  const [renderVideo, setRenderVideo] = useState(!1), select = React.useCallback(() => onSelect?.(asset), [onSelect, asset]), edit = React.useCallback(() => onEdit?.(asset), [onEdit, asset]);
  if (!asset)
    return null;
  const playbackPolicy = getPlaybackPolicy(asset);
  return /* @__PURE__ */ jsxs(
    Card,
    {
      border: !0,
      padding: 2,
      sizing: "border",
      radius: 2,
      style: {
        position: "relative"
      },
      children: [
        playbackPolicy === "signed" && /* @__PURE__ */ jsx(
          Tooltip,
          {
            animate: !0,
            content: /* @__PURE__ */ jsx(Card, { padding: 2, radius: 2, children: /* @__PURE__ */ jsx(IconInfo, { icon: LockIcon, text: "Signed playback policy", size: 2 }) }),
            placement: "right",
            fallbackPlacements: ["top", "bottom"],
            portal: !0,
            children: /* @__PURE__ */ jsx(
              Card,
              {
                tone: "caution",
                style: {
                  borderRadius: "100%",
                  position: "absolute",
                  left: "1em",
                  top: "1em",
                  zIndex: 10
                },
                padding: 2,
                border: !0,
                children: /* @__PURE__ */ jsx(Text, { muted: !0, size: 1, children: /* @__PURE__ */ jsx(LockIcon, {}) })
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs(
          Stack,
          {
            space: 3,
            height: "fill",
            style: {
              gridTemplateRows: "min-content min-content 1fr"
            },
            children: [
              renderVideo ? /* @__PURE__ */ jsx(VideoPlayer, { asset, autoPlay: !0, forceAspectRatio: THUMBNAIL_ASPECT_RATIO }) : /* @__PURE__ */ jsxs(PlayButton, { onClick: () => setRenderVideo(!0), children: [
                /* @__PURE__ */ jsx("div", { "data-play": !0, children: /* @__PURE__ */ jsx(PlayIcon, {}) }),
                assetIsAudio(asset) ? /* @__PURE__ */ jsx(
                  "div",
                  {
                    style: {
                      aspectRatio: THUMBNAIL_ASPECT_RATIO,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    },
                    children: /* @__PURE__ */ jsx(AudioIcon, { width: "3em", height: "3em" })
                  }
                ) : /* @__PURE__ */ jsx(VideoThumbnail, { asset })
              ] }),
              /* @__PURE__ */ jsx(VideoMetadata, { asset }),
              /* @__PURE__ */ jsxs(
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
                    onSelect && /* @__PURE__ */ jsx(
                      Button,
                      {
                        icon: CheckmarkIcon,
                        fontSize: 2,
                        padding: 2,
                        mode: "ghost",
                        text: "Select",
                        style: { flex: 1 },
                        tone: "positive",
                        onClick: select
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        icon: EditIcon,
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
const PageSelector = (props) => {
  const page = props.page, setPage = props.setPage;
  return Math.min(props.total - 1, Math.max(0, page)) !== page && setPage((page2) => Math.min(props.total - 1, Math.max(0, page2))), /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Button, { icon: ChevronLeftIcon, mode: "bleed", padding: 3, style: { cursor: "pointer" }, disabled: page <= 0, onClick: () => {
      setPage((page2) => Math.min(props.total - 1, Math.max(0, page2 - 1)));
    } }),
    /* @__PURE__ */ jsxs(Label$1, { muted: !0, children: [
      "Page ",
      page + 1,
      "/",
      props.total
    ] }),
    /* @__PURE__ */ jsx(Button, { icon: ChevronRightIcon, mode: "bleed", padding: 3, style: { cursor: "pointer" }, disabled: page >= props.total - 1, onClick: () => {
      setPage((page2) => Math.min(props.total - 1, Math.max(0, page2 + 1)));
    } })
  ] });
};
function VideosBrowser({ onSelect }) {
  const { assets, isLoading, searchQuery, setSearchQuery, setSort, sort } = useAssets(), [page, setPage] = useState(0), pageLimit = 18, pageTotal = Math.floor(assets.length / pageLimit) + 1, [editedAsset, setEditedAsset] = useState(null), freshEditedAsset = useMemo(
    () => assets.find((a2) => a2._id === editedAsset?._id) || editedAsset,
    [editedAsset, assets]
  ), pageStart = page * pageLimit, pageEnd = pageStart + pageLimit;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Stack, { padding: 4, space: 4, style: { minHeight: "50vh" }, children: [
      /* @__PURE__ */ jsxs(Flex, { justify: "space-between", align: "center", children: [
        /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 3, children: [
          /* @__PURE__ */ jsx(
            TextInput,
            {
              value: searchQuery,
              icon: SearchIcon,
              onInput: (e) => setSearchQuery(e.currentTarget.value),
              placeholder: "Search videos"
            }
          ),
          /* @__PURE__ */ jsx(SelectSortOptions, { setSort, sort }),
          /* @__PURE__ */ jsx(PageSelector, { page, setPage, total: pageTotal, limit: pageLimit })
        ] }),
        (onSelect ? "input" : "tool") == "tool" && /* @__PURE__ */ jsxs(Inline, { space: 2, children: [
          /* @__PURE__ */ jsx(ImportVideosFromMux, {}),
          /* @__PURE__ */ jsx(ResyncMetadata, {}),
          /* @__PURE__ */ jsx(ConfigureApi, {})
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Stack, { space: 3, children: [
        assets?.length > 0 && /* @__PURE__ */ jsxs(Label$1, { muted: !0, children: [
          assets.length,
          " video",
          assets.length > 1 ? "s" : null,
          " ",
          searchQuery ? `matching "${searchQuery}"` : "found"
        ] }),
        /* @__PURE__ */ jsx(
          Grid,
          {
            gap: 2,
            style: {
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))"
            },
            children: assets.slice(pageStart, pageEnd).map((asset) => /* @__PURE__ */ jsx(
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
      isLoading && /* @__PURE__ */ jsx(SpinnerBox, {}),
      !isLoading && assets.length === 0 && /* @__PURE__ */ jsx(Card, { marginY: 4, paddingX: 4, paddingY: 6, border: !0, radius: 2, tone: "transparent", children: /* @__PURE__ */ jsx(Text, { align: "center", muted: !0, size: 3, children: searchQuery ? `No videos found for "${searchQuery}"` : "No videos in this dataset" }) })
    ] }),
    freshEditedAsset && /* @__PURE__ */ jsx(VideoDetails, { closeDialog: () => setEditedAsset(null), asset: freshEditedAsset })
  ] });
}
const StudioTool = () => /* @__PURE__ */ jsx(VideosBrowser, {}), DEFAULT_TOOL_CONFIG = {
  icon: ToolIcon,
  title: "Videos"
};
function createStudioTool(config) {
  const toolConfig = typeof config.tool == "object" ? config.tool : DEFAULT_TOOL_CONFIG;
  return {
    name: "mux",
    icon: toolConfig.icon || DEFAULT_TOOL_CONFIG.icon,
    title: toolConfig.title || DEFAULT_TOOL_CONFIG.title,
    component: (props) => /* @__PURE__ */ jsx(StudioTool, { ...config, ...props })
  };
}
const useAccessControl = (config) => {
  const user = useCurrentUser();
  return { hasConfigAccess: !config?.allowedRolesForConfiguration?.length || user?.roles?.some((role) => config.allowedRolesForConfiguration.includes(role.name)) };
}, path = ["assetId", "data", "playbackId", "status", "thumbTime", "filename"], useAssetDocumentValues = (asset) => useDocumentValues(
  isReference(asset) ? asset._ref : "",
  path
), useMuxPolling = (asset) => {
  const client = useClient(), projectId = useProjectId(), dataset = useDataset(), isPreparingStaticRenditions = useMemo(() => {
    if (asset?.data?.static_renditions?.status && asset?.data?.static_renditions?.status !== "disabled")
      return !1;
    const files = asset?.data?.static_renditions?.files;
    return !files || files.length === 0 ? !1 : files.some((file) => file.status === "preparing");
  }, [asset?.data?.static_renditions?.status, asset?.data?.static_renditions?.files]), shouldFetch = useMemo(
    () => !!asset?.assetId && (asset?.status === "preparing" || isPreparingStaticRenditions),
    [asset?.assetId, asset?.status, isPreparingStaticRenditions]
  );
  return useSWR(
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
})(PureComponent), u = function(r, t) {
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
  var a2 = useReducer(u, { didCatch: !1, error: null }), i = a2[0], d = a2[1], h = useRef(null);
  function l() {
    return e = function(r, e2) {
      d({ type: "catch", error: r }), t && t.onDidCatch && t.onDidCatch(r, e2);
    }, function(t2) {
      return React.createElement(c, { onDidCatch: e, children: t2.children, render: t2.render, renderError: t2.renderError });
    };
    var e;
  }
  var p, s = useCallback(function() {
    h.current = l(), d({ type: "reset" });
  }, []);
  return { ErrorBoundary: (p = h.current, p !== null ? p : (h.current = l(), h.current)), didCatch: i.didCatch, error: i.error, reset: s };
}
function ErrorBoundaryCard(props) {
  const { children, schemaType } = props, { push: pushToast } = useToast(), errorRef = useRef(null), { ErrorBoundary, didCatch, error, reset } = a({
    onDidCatch: (err, errorInfo) => {
      console.group(err.toString()), console.groupCollapsed("console.error"), console.error(err), console.groupEnd(), err.stack && (console.groupCollapsed("error.stack"), console.log(err.stack), console.groupEnd()), errorInfo?.componentStack && (console.groupCollapsed("errorInfo.componentStack"), console.log(errorInfo.componentStack), console.groupEnd()), console.groupEnd(), pushToast({
        status: "error",
        title: "Plugin crashed",
        description: /* @__PURE__ */ jsx(Flex, { align: "center", children: /* @__PURE__ */ jsxs(Inline, { space: 1, children: [
          "An error happened while rendering",
          /* @__PURE__ */ jsx(
            Button,
            {
              padding: 1,
              fontSize: 1,
              style: { transform: "translateY(1px)" },
              mode: "ghost",
              text: schemaType.title,
              onClick: () => {
                errorRef.current && scrollIntoView(errorRef.current, {
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
  }), handleRetry = useCallback(() => {
    clear([name]), reset();
  }, [reset]);
  return didCatch ? /* @__PURE__ */ jsx(Card, { ref: errorRef, paddingX: [2, 3, 4, 4], height: "fill", shadow: 1, overflow: "auto", children: /* @__PURE__ */ jsx(Flex, { justify: "flex-start", align: "center", height: "fill", children: /* @__PURE__ */ jsxs(Grid, { columns: 1, gap: [2, 3, 4, 4], children: [
    /* @__PURE__ */ jsxs(Heading, { as: "h1", children: [
      "The ",
      /* @__PURE__ */ jsx("code", { children: name }),
      " plugin crashed"
    ] }),
    error?.message && /* @__PURE__ */ jsx(Card, { padding: 3, tone: "critical", shadow: 1, radius: 2, children: /* @__PURE__ */ jsx(Text, { children: error.message }) }),
    /* @__PURE__ */ jsx(Inline, { children: /* @__PURE__ */ jsx(Button, { onClick: handleRetry, text: "Retry" }) })
  ] }) }) }) : /* @__PURE__ */ jsx(ErrorBoundary, { children });
}
var ErrorBoundaryCard$1 = memo(ErrorBoundaryCard);
const InputFallback = () => /* @__PURE__ */ jsx("div", { style: { padding: 1 }, children: /* @__PURE__ */ jsx(
  Card,
  {
    shadow: 1,
    sizing: "border",
    style: { aspectRatio: "16/9", width: "100%", borderRadius: "1px" },
    children: /* @__PURE__ */ jsxs(Flex, { align: "center", direction: "column", height: "fill", justify: "center", children: [
      /* @__PURE__ */ jsx(Spinner, { muted: !0 }),
      /* @__PURE__ */ jsx(Box, { marginTop: 3, children: /* @__PURE__ */ jsx(Text, { align: "center", muted: !0, size: 1, children: "Loading\u2026" }) })
    ] })
  }
) });
function Onboard(props) {
  const { setDialogState } = props, handleOpen = useCallback(() => setDialogState("secrets"), [setDialogState]), { hasConfigAccess } = useAccessControl(props.config);
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", { style: { padding: 2 }, children: /* @__PURE__ */ jsx(
    Card,
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
      children: /* @__PURE__ */ jsx(Flex, { justify: "flex-start", align: "center", children: /* @__PURE__ */ jsxs(Grid, { columns: 1, gap: [2, 3, 4, 4], children: [
        /* @__PURE__ */ jsx(Inline, { paddingY: 1, children: /* @__PURE__ */ jsx("div", { style: { height: "32px" }, children: /* @__PURE__ */ jsx(MuxLogo, {}) }) }),
        /* @__PURE__ */ jsx(Inline, { paddingY: 1, children: /* @__PURE__ */ jsx(Heading, { size: [0, 1, 2, 2], children: "Upload and preview videos directly from your studio." }) }),
        /* @__PURE__ */ jsx(Inline, { paddingY: 1, children: hasConfigAccess ? /* @__PURE__ */ jsx(Button, { mode: "ghost", icon: PlugIcon, text: "Configure API", onClick: handleOpen }) : /* @__PURE__ */ jsx(Card, { padding: [3, 3, 3], radius: 2, shadow: 1, tone: "critical", children: /* @__PURE__ */ jsx(Text, { children: "You do not have access to configure the Mux API. Please contact your administrator." }) }) })
      ] }) })
    }
  ) }) });
}
function createUpChunkObservable(uuid2, uploadUrl2, source) {
  return new Observable((subscriber) => {
    const upchunk = UpChunk.createUpload({
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
      upchunk.pause(), subscriber.next({
        type: "pause",
        id: uuid2
      });
    }, onlineHandler = () => {
      upchunk.resume(), subscriber.next({
        type: "resume",
        id: uuid2
      });
    };
    return upchunk.on("success", successHandler), upchunk.on("error", errorHandler), upchunk.on("progress", progressHandler), upchunk.on("offline", offlineHandler), upchunk.on("online", onlineHandler), () => upchunk.abort();
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
    switchMap((validUrl) => concat(
      of({ type: "url", url: validUrl }),
      testSecretsObservable(client).pipe(
        switchMap((json) => {
          if (!json || !json.status)
            return throwError(new Error("Invalid credentials"));
          const uuid$1 = uuid(), muxBody = settings;
          muxBody.input || (muxBody.input = [{ type: "video" }]), muxBody.input[0].url = validUrl;
          const query = {
            muxBody: JSON.stringify(muxBody),
            filename: assetName || validUrl.split("/").slice(-1)[0]
          }, dataset = client.config().dataset;
          return defer(
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
            mergeMap((result) => {
              const asset = result && result.results && result.results[0] && result.results[0].document || null;
              return asset ? of({ type: "success", id: uuid$1, asset }) : throwError(new Error("No asset document returned"));
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
    switchMap((fileOptions) => concat(
      of({ type: "file", file: fileOptions }),
      testSecretsObservable(client).pipe(
        switchMap((json) => {
          if (!json || !json.status)
            return throwError(() => new Error("Invalid credentials"));
          const uuid$1 = uuid(), body = settings;
          return concat(
            of({ type: "uuid", uuid: uuid$1 }),
            defer(
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
              mergeMap((result) => createUpChunkObservable(uuid$1, result.upload.url, file).pipe(
                // eslint-disable-next-line no-warning-comments
                // @TODO type the observable events
                // eslint-disable-next-line max-nested-callbacks
                mergeMap((event) => event.type !== "success" ? of(event) : from(updateAssetDocumentFromUpload(client, uuid$1, assetName)).pipe(
                  // eslint-disable-next-line max-nested-callbacks
                  mergeMap((doc) => of({ ...event, asset: doc }))
                )),
                // eslint-disable-next-line max-nested-callbacks
                catchError((err) => cancelUpload(client, uuid$1).pipe(mergeMapTo(throwError(err))))
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
    return of(fileOptions);
  }
  return throwError(new Error("Invalid file"));
}
function testUrl(url) {
  const error = new Error("Invalid URL");
  if (typeof url != "string")
    return throwError(error);
  let formattedUrl = url.trim();
  formattedUrl = formatDriveShareLink(formattedUrl);
  let parsed;
  try {
    parsed = new URL(formattedUrl);
  } catch {
    return throwError(error);
  }
  return parsed && !parsed.protocol.match(/http:|https:/) ? throwError(error) : of(formattedUrl);
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
      PatchEvent.from([
        set({ _type: "metadata", ...data }, ["data"])
      ])
    ), subscription.unsubscribe());
  });
};
function SelectAssets({ asset: selectedAsset, onChange, setDialogState, config }) {
  const handleSelect = useCallback(
    (chosenAsset) => {
      if (chosenAsset?._id || onChange(PatchEvent.from([unset(["asset"])])), chosenAsset._id !== selectedAsset?._id) {
        const patches = [];
        patches.push(setIfMissing({ asset: {}, _type: "mux.video" })), patches.push(set({ _type: "reference", _weak: !0, _ref: chosenAsset._id }, ["asset"])), config.inlineAssetMetadata && (patches.push(setIfMissing({ data: {} })), patches.push(set({ _type: "metadata", ...chosenAsset.data ?? {} }, ["data"]))), onChange(PatchEvent.from(patches));
      }
      setDialogState(!1);
    },
    [onChange, setDialogState, selectedAsset]
  );
  return /* @__PURE__ */ jsx(VideosBrowser, { onSelect: handleSelect });
}
const StyledDialog = styled(Dialog)`
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
  const id = `InputBrowser${useId()}`, handleClose = useCallback(() => setDialogState(!1), [setDialogState]);
  return /* @__PURE__ */ jsx(
    StyledDialog,
    {
      __unstable_autoFocus: !0,
      header: "Select video",
      id,
      onClose: handleClose,
      width: 2,
      children: /* @__PURE__ */ jsx(SelectAssets, { asset, onChange, setDialogState, config })
    }
  );
}
const useCancelUpload = (asset, onChange) => {
  const client = useClient();
  return useCallback(() => {
    asset && (onChange(PatchEvent.from(unset())), asset.assetId && deleteAssetOnMux(client, asset.assetId), asset._id && client.delete(asset._id));
  }, [asset, client, onChange]);
};
styled.div`
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
const TopControls = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  justify-content: flex-end;
  button {
    height: auto;
  }
`, CardWrapper = styled(Card)`
  min-height: 82px;
  box-sizing: border-box;
`, FlexWrapper = styled(Flex)`
  text-overflow: ellipsis;
  overflow: hidden;
`, LeftSection = styled(Stack)`
  position: relative;
  width: 60%;
`, CodeWrapper = styled(Code)`
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
  return /* @__PURE__ */ jsx(CardWrapper, { tone: "primary", padding: 4, border: !0, height: "fill", children: /* @__PURE__ */ jsxs(FlexWrapper, { align: "center", justify: "space-between", height: "fill", direction: "row", gap: 2, children: [
    /* @__PURE__ */ jsxs(LeftSection, { children: [
      /* @__PURE__ */ jsx(Flex, { justify: "center", gap: [3, 3, 2, 2], direction: ["column", "column", "row"], children: /* @__PURE__ */ jsx(Text, { size: 1, children: /* @__PURE__ */ jsxs(Inline, { space: 2, children: [
        text,
        /* @__PURE__ */ jsx(CodeWrapper, { size: 1, children: filename || "..." })
      ] }) }) }),
      /* @__PURE__ */ jsx(Card, { marginTop: 3, radius: 5, shadow: 1, children: /* @__PURE__ */ jsx(LinearProgress, { value: progress }) })
    ] }),
    onCancel ? /* @__PURE__ */ jsx(
      Button,
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
}, Player = ({ asset, buttons, readOnly, onChange }) => {
  const isLoading = useMemo(() => asset?.status === "preparing" ? "Preparing the video" : asset?.status === "waiting_for_upload" ? "Waiting for upload to start" : asset?.status === "waiting" ? "Processing upload" : !(asset?.status === "ready" || typeof asset?.status > "u"), [asset]), isPreparingStaticRenditions = useMemo(() => {
    if (asset?.data?.static_renditions?.status && asset?.data?.static_renditions?.status !== "disabled")
      return !1;
    const files = asset?.data?.static_renditions?.files;
    return !files || files.length === 0 ? !1 : files.some((file) => file.status === "preparing");
  }, [asset?.data?.static_renditions?.status, asset?.data?.static_renditions?.files]), playRef = useRef(null), muteRef = useRef(null), handleCancelUpload = useCancelUpload(asset, onChange);
  return useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = "button svg { vertical-align: middle; }", playRef.current?.shadowRoot && playRef.current.shadowRoot.appendChild(style), muteRef?.current?.shadowRoot && muteRef.current.shadowRoot.appendChild(style.cloneNode(!0));
  }, []), useEffect(() => {
    if (asset?.status === "errored")
      throw handleCancelUpload(), new Error(asset.data?.errors?.messages?.join(" "));
  }, [asset.data?.errors?.messages, asset?.status, handleCancelUpload]), !asset || !asset.status ? null : isLoading ? /* @__PURE__ */ jsx(
    UploadProgress,
    {
      progress: 100,
      filename: asset?.filename,
      text: isLoading !== !0 && isLoading || "Waiting for Mux to complete the upload",
      onCancel: readOnly ? void 0 : () => handleCancelUpload()
    }
  ) : /* @__PURE__ */ jsxs(VideoPlayer, { asset, children: [
    buttons && /* @__PURE__ */ jsx(TopControls, { slot: "top-chrome", children: buttons }),
    isPreparingStaticRenditions && /* @__PURE__ */ jsx(
      Card,
      {
        padding: 2,
        radius: 1,
        style: {
          background: "var(--card-fg-color)",
          position: "absolute",
          top: "0.5em",
          left: "0.5em"
        },
        children: /* @__PURE__ */ jsx(Text, { size: 1, style: { color: "var(--card-bg-color)" }, children: "MUX is preparing static renditions, please stand by" })
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
const FileButton = styled(MenuItem)(({ theme }) => {
  const { focusRing } = theme.sanity, base = theme.sanity.color.base;
  return css`
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
}), FileInputMenuItem = React.forwardRef(function(props, forwardedRef) {
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
  } = props, idHook = useId(), id = idProp || idHook, handleChange = React.useCallback(
    (event) => {
      onSelect && event.target.files && onSelect(Array.from(event.target.files));
    },
    [onSelect]
  ), content = /* @__PURE__ */ jsxs(Flex, { align: "center", justify: "flex-start", children: [
    icon && /* @__PURE__ */ jsx(Box, { marginRight: text ? space : void 0, children: /* @__PURE__ */ jsxs(Text, { size: fontSize, children: [
      isValidElement(icon) && icon,
      isValidElementType(icon) && createElement(icon)
    ] }) }),
    text && /* @__PURE__ */ jsx(Text, { align: textAlign, size: fontSize, textOverflow: "ellipsis", children: text })
  ] });
  return /* @__PURE__ */ jsxs(FileButton, { ...rest, htmlFor: id, disabled, ref: forwardedRef, children: [
    content,
    /* @__PURE__ */ jsx(
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
}), LockCard = styled(Card)`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.6;
  mix-blend-mode: screen;
  background: transparent;
`, LockButton = styled(Button)`
  background: transparent;
  color: white;
`, isVideoAsset = (asset) => asset._type === "mux.videoAsset";
function PlayerActionsMenu(props) {
  const { asset, readOnly, dialogState, setDialogState, onChange, onSelect, accept } = props, [open, setOpen] = useState(!1), [menuElement, setMenuRef] = useState(null), isSigned = useMemo(() => getPlaybackPolicy(asset) === "signed", [asset]), { hasConfigAccess } = useAccessControl(props.config), onReset = useCallback(() => onChange(PatchEvent.from(unset([]))), [onChange]);
  return useEffect(() => {
    open && dialogState && setOpen(!1);
  }, [dialogState, open]), useClickOutsideEvent(
    () => setOpen(!1),
    () => [menuElement]
  ), /* @__PURE__ */ jsxs(Inline, { space: 1, padding: 2, children: [
    isSigned && /* @__PURE__ */ jsx(
      Tooltip,
      {
        animate: !0,
        content: /* @__PURE__ */ jsx(Box, { padding: 2, children: /* @__PURE__ */ jsx(Text, { muted: !0, size: 1, children: "Signed playback policy" }) }),
        placement: "right",
        portal: !0,
        children: /* @__PURE__ */ jsx(LockCard, { radius: 2, margin: 2, scheme: "dark", tone: "positive", children: /* @__PURE__ */ jsx(LockButton, { icon: LockIcon, mode: "bleed", tone: "positive" }) })
      }
    ),
    /* @__PURE__ */ jsx(
      Popover,
      {
        animate: !0,
        content: /* @__PURE__ */ jsxs(Menu, { ref: setMenuRef, children: [
          /* @__PURE__ */ jsx(Box, { padding: 2, children: /* @__PURE__ */ jsx(Label$1, { muted: !0, size: 1, children: "Replace" }) }),
          /* @__PURE__ */ jsx(
            FileInputMenuItem,
            {
              accept,
              icon: UploadIcon,
              onSelect,
              text: "Upload",
              disabled: readOnly,
              fontSize: 1
            }
          ),
          /* @__PURE__ */ jsx(
            MenuItem,
            {
              icon: SearchIcon,
              text: "Browse",
              onClick: () => setDialogState("select-video")
            }
          ),
          isVideoAsset(asset) && /* @__PURE__ */ jsx(
            MenuItem,
            {
              icon: ImageIcon,
              text: "Thumbnail",
              onClick: () => setDialogState("edit-thumbnail")
            }
          ),
          /* @__PURE__ */ jsx(MenuDivider, {}),
          hasConfigAccess && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              MenuItem,
              {
                icon: PlugIcon,
                text: "Configure API",
                onClick: () => setDialogState("secrets")
              }
            ),
            /* @__PURE__ */ jsx(MenuDivider, {})
          ] }),
          /* @__PURE__ */ jsx(
            MenuItem,
            {
              tone: "critical",
              icon: ResetIcon,
              text: "Clear field",
              onClick: onReset,
              disabled: readOnly
            }
          )
        ] }),
        portal: !0,
        open,
        children: /* @__PURE__ */ jsx(
          Button,
          {
            icon: EllipsisHorizontalIcon,
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
var PlayerActionsMenu$1 = memo(PlayerActionsMenu);
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
const ALL_LANGUAGE_CODES = LanguagesList.getAllCodes().map((code) => ({
  value: code,
  label: LanguagesList.getNativeName(code)
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
  return /* @__PURE__ */ jsx(FormField$2, { title: "Auto-generated subtitle or caption", children: /* @__PURE__ */ jsxs(Stack, { space: 2, children: [
    /* @__PURE__ */ jsxs(Flex, { align: "center", children: [
      /* @__PURE__ */ jsx(
        Checkbox,
        {
          id: "include-autogenerated-track",
          style: { display: "block" },
          checked: !!track?.language_code,
          onChange: () => {
            dispatch(track ? { action: "track", id: track._id, subAction: "delete" } : {
              action: "track",
              id: uuid(),
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
      /* @__PURE__ */ jsx(Box, { flex: 1, paddingLeft: 3, children: /* @__PURE__ */ jsx(Text, { children: /* @__PURE__ */ jsx("label", { htmlFor: "checkbox", children: "Generate captions" }) }) })
    ] }),
    track && /* @__PURE__ */ jsx(
      Autocomplete,
      {
        id: "text-tract-editor--language",
        value: track.language_code,
        onChange: (newValue) => dispatch({
          action: "track",
          id: track._id,
          subAction: "update",
          value: {
            language_code: newValue,
            name: LanguagesList.getNativeName(newValue)
          }
        }),
        options: SUBTITLE_LANGUAGES[track.type],
        icon: TranslateIcon,
        placeholder: "Select language",
        filterOption: (query, option) => option.label.toLowerCase().indexOf(query.toLowerCase()) > -1 || option.value.toLowerCase().indexOf(query.toLowerCase()) > -1,
        openButton: !0,
        renderValue: (value) => SUBTITLE_LANGUAGES[track.type].find((l) => l.value === value)?.label || value,
        renderOption: (option) => /* @__PURE__ */ jsx(Card, { "data-as": "button", padding: 3, radius: 2, tone: "inherit", children: /* @__PURE__ */ jsxs(Text, { size: 2, textOverflow: "ellipsis", children: [
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
  action
}) {
  const [scale, setScale] = useState(1), boxStyle = {
    outline: "0.01rem solid grey",
    transform: `scale(${scale})`,
    transition: "transform 0.1s ease-in-out",
    cursor: "pointer",
    borderRadius: "0.25rem"
  }, triggerAnimation = () => {
    setScale(0.98), setTimeout(() => {
      setScale(1);
    }, 100);
  };
  return /* @__PURE__ */ jsx("label", { children: /* @__PURE__ */ jsxs(Flex, { gap: 3, padding: 3, style: boxStyle, children: [
    /* @__PURE__ */ jsx(Checkbox, { id, required: !0, checked, onChange: () => {
      triggerAnimation(), dispatch({
        action,
        value: !checked
      });
    } }),
    /* @__PURE__ */ jsxs(Grid, { gap: 3, children: [
      /* @__PURE__ */ jsx(Text, { size: 3, weight: "bold", children: optionName }),
      /* @__PURE__ */ jsx(Text, { size: 2, muted: !0, children: description })
    ] })
  ] }) });
}
function PlaybackPolicyWarning() {
  return /* @__PURE__ */ jsx(Box, { padding: 2, style: {
    outline: "0.01rem solid grey",
    backgroundColor: "#979cb0",
    borderRadius: "0.5rem",
    width: "max-content",
    color: "#13141A"
  }, children: /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 2, children: [
    /* @__PURE__ */ jsx(WarningFilledIcon, {}),
    /* @__PURE__ */ jsx(Text, { size: 1, style: {
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
  const noPolicySelected = !(config.public_policy || config.signed_policy);
  return /* @__PURE__ */ jsxs(Grid, { gap: 3, children: [
    /* @__PURE__ */ jsx(Text, { weight: "bold", children: "Advanced Playback Policies" }),
    /* @__PURE__ */ jsx(
      PlaybackPolicyOption,
      {
        id: `${id}--public`,
        checked: config.public_policy,
        optionName: "Public",
        description: "Playback IDs are accessible by constructing an HLS URL like https://stream.mux.com/{PLAYBACK_ID}",
        dispatch,
        action: "public_policy"
      }
    ),
    secrets.enableSignedUrls && /* @__PURE__ */ jsx(
      PlaybackPolicyOption,
      {
        id: `${id}--signed`,
        checked: config.signed_policy,
        optionName: "Signed",
        description: `Playback IDs should be used with tokens https://stream.mux.com/{PLAYBACK_ID}?token={TOKEN}. \r
                // See Secure video playback for details about creating tokens.`,
        dispatch,
        action: "signed_policy"
      }
    ),
    noPolicySelected && /* @__PURE__ */ jsx(PlaybackPolicyWarning, {})
  ] });
}
const VIDEO_QUALITY_LEVELS = [
  { value: "basic", label: "Basic" },
  { value: "plus", label: "Plus" },
  { value: "premium", label: "Premium" }
], RESOLUTION_TIERS = [
  { value: "1080p", label: "1080p" },
  { value: "1440p", label: "1440p (2k)" },
  { value: "2160p", label: "2160p (4k)" }
], ADVANCED_RESOLUTIONS = [
  { value: "270p", label: "270p" },
  { value: "360p", label: "360p" },
  { value: "480p", label: "480p" },
  { value: "540p", label: "540p" },
  { value: "720p", label: "720p" },
  { value: "1080p", label: "1080p" },
  { value: "1440p", label: "1440p" },
  { value: "2160p", label: "2160p" }
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
  const id = useId(), autoTextTracks = useRef(
    pluginConfig.video_quality === "plus" && pluginConfig.defaultAutogeneratedSubtitleLang ? [
      {
        _id: uuid(),
        type: "autogenerated",
        language_code: pluginConfig.defaultAutogeneratedSubtitleLang,
        name: LanguagesList.getNativeName(pluginConfig.defaultAutogeneratedSubtitleLang)
      }
    ] : []
  ).current, [config, dispatch] = useReducer(
    (prev, action) => {
      switch (action.action) {
        case "video_quality":
          return action.value === "basic" ? Object.assign({}, prev, {
            video_quality: action.value,
            static_renditions: [],
            max_resolution_tier: "1080p",
            text_tracks: prev.text_tracks?.filter(({ type }) => type !== "autogenerated"),
            public_policy: !0,
            signed_policy: !1
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
      normalize_audio: pluginConfig.normalize_audio,
      text_tracks: autoTextTracks,
      asset_name: stagedUpload.type === "file" ? stagedUpload.files[0].name : stagedUpload.url
    }
  ), isAdvancedMode = useMemo(() => config.static_renditions.filter(
    (r) => r !== "highest" && r !== "audio-only"
  ).length > 0, [config.static_renditions]), [renditionMode, setRenditionMode] = useState(
    isAdvancedMode ? "advanced" : "standard"
  ), [videoDuration, setVideoDuration] = useState(null), [urlFileSize, setUrlFileSize] = useState(null), [isLoadingDuration, setIsLoadingDuration] = useState(!1), [isLoadingFileSize, setIsLoadingFileSize] = useState(!1), [validationError, setValidationError] = useState(null), [canSkipFileSizeValidation, setCanSkipFileSizeValidation] = useState(!1), MAX_FILE_SIZE = pluginConfig.maxAssetFileSize, MAX_DURATION_SECONDS = pluginConfig.maxAssetDuration;
  useEffect(() => {
    setVideoDuration(null), setUrlFileSize(null), setIsLoadingDuration(!1), setIsLoadingFileSize(!1), setValidationError(null), setCanSkipFileSizeValidation(!1);
    let videoElement = null, currentVideoSrc = null;
    const cleanupVideo = (shouldRevokeUrl) => {
      videoElement && (videoElement.onloadedmetadata = null, videoElement.onerror = null, videoElement.src = "", videoElement.load(), videoElement = null), shouldRevokeUrl && currentVideoSrc?.startsWith("blob:") && URL.revokeObjectURL(currentVideoSrc), currentVideoSrc = null;
    }, validateDuration = (videoSrc, shouldRevokeUrl = !1) => {
      !MAX_DURATION_SECONDS || MAX_DURATION_SECONDS <= 0 || (setIsLoadingDuration(!0), videoElement = document.createElement("video"), videoElement.preload = "metadata", currentVideoSrc = videoSrc, videoElement.onloadedmetadata = () => {
        const duration = videoElement.duration;
        setVideoDuration(duration), setIsLoadingDuration(!1), duration > MAX_DURATION_SECONDS && setValidationError(
          `Video duration (${formatSeconds(duration)}) exceeds maximum allowed duration of ${formatSeconds(MAX_DURATION_SECONDS)}`
        ), cleanupVideo(shouldRevokeUrl);
      }, videoElement.onerror = () => {
        setIsLoadingDuration(!1), console.warn("Could not read video metadata for validation"), cleanupVideo(shouldRevokeUrl);
      }, videoElement.src = videoSrc);
    }, validateFileSize = (size) => MAX_FILE_SIZE === void 0 || size <= MAX_FILE_SIZE ? !0 : (setValidationError(
      `File size (${formatBytes(size)}) exceeds maximum allowed size of ${formatBytes(MAX_FILE_SIZE)}`
    ), !1);
    if (stagedUpload.type === "file") {
      const file = stagedUpload.files[0];
      validateFileSize(file.size) && validateDuration(URL.createObjectURL(file), !0);
    }
    if (stagedUpload.type === "url") {
      const url = stagedUpload.url;
      (async () => {
        setIsLoadingFileSize(!0);
        try {
          const contentLength = (await fetch(url, { method: "HEAD" })).headers.get("content-length"), fileSize = contentLength ? parseInt(contentLength, 10) : null;
          setIsLoadingFileSize(!1), fileSize && setUrlFileSize(fileSize);
          const shouldValidateDuration = MAX_FILE_SIZE === void 0 || fileSize === null || validateFileSize(fileSize);
          fileSize === null && MAX_FILE_SIZE !== void 0 && setCanSkipFileSizeValidation(!0), shouldValidateDuration && validateDuration(url);
        } catch {
          setIsLoadingFileSize(!1), console.warn("Could not validate file size from URL"), setCanSkipFileSizeValidation(!0), validateDuration(url);
        }
      })();
    }
    return () => {
      cleanupVideo(!0);
    };
  }, [stagedUpload, MAX_FILE_SIZE, MAX_DURATION_SECONDS]);
  const toggleRendition = (rendition) => {
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
  }, { disableTextTrackConfig, disableUploadConfig, disableAssetNameConfig } = pluginConfig, skipConfig = disableTextTrackConfig && disableUploadConfig && disableAssetNameConfig;
  if (useEffect(() => {
    skipConfig && startUpload(formatUploadConfig(config), config.asset_name);
  }, []), skipConfig) return null;
  const basicConfig = config.video_quality !== "plus" && config.video_quality !== "premium", maxSupportedResolution = RESOLUTION_TIERS.findIndex(
    (rt) => rt.value === pluginConfig.max_resolution_tier
  );
  return /* @__PURE__ */ jsx(
    Dialog,
    {
      animate: !0,
      open: !0,
      id: "upload-configuration",
      zOffset: 1e3,
      width: 1,
      header: "Configure Mux Upload",
      onClose,
      children: /* @__PURE__ */ jsxs(Stack, { padding: 4, space: 2, children: [
        validationError && /* @__PURE__ */ jsx(Card, { padding: 3, tone: "critical", radius: 2, marginBottom: 2, children: /* @__PURE__ */ jsxs(Flex, { gap: 2, align: "flex-start", children: [
          /* @__PURE__ */ jsx(ErrorOutlineIcon, { width: 20, height: 20 }),
          /* @__PURE__ */ jsxs(Stack, { space: 2, children: [
            /* @__PURE__ */ jsx(Text, { size: 1, weight: "semibold", children: "Validation Error" }),
            /* @__PURE__ */ jsx(Text, { size: 1, children: validationError })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(Label$1, { size: 3, children: "FILE TO UPLOAD" }),
        /* @__PURE__ */ jsx(
          Card,
          {
            tone: "transparent",
            border: !0,
            padding: 3,
            paddingY: 4,
            style: { borderRadius: "0.1865rem" },
            children: /* @__PURE__ */ jsxs(Flex, { gap: 2, children: [
              /* @__PURE__ */ jsx(DocumentVideoIcon, { fontSize: "2em" }),
              /* @__PURE__ */ jsxs(Stack, { space: 2, children: [
                /* @__PURE__ */ jsx(Text, { textOverflow: "ellipsis", as: "h2", size: 3, children: stagedUpload.type === "file" ? stagedUpload.files[0].name : stagedUpload.url }),
                /* @__PURE__ */ jsx(Text, { as: "p", size: 1, muted: !0, children: stagedUpload.type === "file" ? `Direct File Upload (${formatBytes(stagedUpload.files[0].size)})` : urlFileSize ? `File From URL (${formatBytes(urlFileSize)})` : isLoadingFileSize ? "File From URL (Loading size...)" : "File From URL (Unknown size)" }),
                stagedUpload.type === "file" && /* @__PURE__ */ jsxs(Stack, { space: 1, children: [
                  isLoadingDuration && /* @__PURE__ */ jsx(Text, { as: "p", size: 1, muted: !0, children: "Reading video metadata..." }),
                  videoDuration !== null && !validationError && /* @__PURE__ */ jsxs(Text, { as: "p", size: 1, muted: !0, children: [
                    "Duration: ",
                    formatSeconds(videoDuration)
                  ] })
                ] })
              ] })
            ] })
          }
        ),
        !disableAssetNameConfig && /* @__PURE__ */ jsx(
          FormField$2,
          {
            title: "Asset Name",
            inputId: "upload-config-set-asset-name",
            description: "Give a friendly name to your asset. This name will be displayed in the asset library on Sanity.",
            children: /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "upload-config-set-asset-name",
                value: config.asset_name ?? "",
                placeholder: "[Notion ID] - Name of the asset (recommended format)",
                onChange: (e) => dispatch({ action: "asset_name", value: e.currentTarget.value })
              }
            )
          }
        ),
        !disableUploadConfig && /* @__PURE__ */ jsxs(Stack, { space: 3, paddingBottom: 2, children: [
          /* @__PURE__ */ jsx(
            FormField$2,
            {
              title: "Video Quality Level",
              description: /* @__PURE__ */ jsxs(Fragment, { children: [
                "The video quality level informs the cost, quality, and available platform features for the asset.",
                " ",
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "https://docs.mux.com/guides/use-encoding-tiers",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    children: "See the Mux guide for more details."
                  }
                )
              ] }),
              children: /* @__PURE__ */ jsx(Flex, { gap: 3, children: VIDEO_QUALITY_LEVELS.map(({ value, label }) => {
                const inputId = `${id}--encodingtier-${value}`;
                return /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 2, children: [
                  /* @__PURE__ */ jsx(
                    Radio,
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
                  /* @__PURE__ */ jsx(Text, { as: "label", htmlFor: inputId, children: label })
                ] }, value);
              }) })
            }
          ),
          !basicConfig && maxSupportedResolution > 0 && /* @__PURE__ */ jsx(
            FormField$2,
            {
              title: "Resolution Tier",
              description: /* @__PURE__ */ jsxs(Fragment, { children: [
                "The maximum",
                " ",
                /* @__PURE__ */ jsx(
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
              children: /* @__PURE__ */ jsx(Flex, { gap: 3, wrap: "wrap", children: RESOLUTION_TIERS.map(({ value, label }, index) => {
                const inputId = `${id}--type-${value}`;
                return index > maxSupportedResolution ? null : /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 2, children: [
                  /* @__PURE__ */ jsx(
                    Radio,
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
                  /* @__PURE__ */ jsx(Text, { as: "label", htmlFor: inputId, children: label })
                ] }, value);
              }) })
            }
          ),
          !basicConfig && /* @__PURE__ */ jsx(FormField$2, { title: "Additional Configuration", children: /* @__PURE__ */ jsxs(Stack, { space: 3, children: [
            /* @__PURE__ */ jsx(PlaybackPolicy, { id, config, secrets, dispatch }),
            /* @__PURE__ */ jsx(Stack, { space: 3, children: /* @__PURE__ */ jsx(
              FormField$2,
              {
                title: "Static Renditions",
                description: "Generate downloadable MP4 or M4A files. Note: Mux will not upscale to produce MP4 renditions - renditions that would cause upscaling are skipped.",
                children: /* @__PURE__ */ jsxs(Stack, { space: 3, children: [
                  /* @__PURE__ */ jsxs(Flex, { gap: 3, children: [
                    /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 2, children: [
                      /* @__PURE__ */ jsx(
                        Radio,
                        {
                          checked: renditionMode === "standard",
                          name: "rendition-mode",
                          onChange: () => handleModeChange("standard"),
                          value: "standard",
                          id: `${id}--mode-standard`
                        }
                      ),
                      /* @__PURE__ */ jsx(Text, { as: "label", htmlFor: `${id}--mode-standard`, children: "Standard" })
                    ] }),
                    /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 2, children: [
                      /* @__PURE__ */ jsx(
                        Radio,
                        {
                          checked: renditionMode === "advanced",
                          name: "rendition-mode",
                          onChange: () => handleModeChange("advanced"),
                          value: "advanced",
                          id: `${id}--mode-advanced`
                        }
                      ),
                      /* @__PURE__ */ jsx(Text, { as: "label", htmlFor: `${id}--mode-advanced`, children: "Advanced" })
                    ] })
                  ] }),
                  renditionMode === "standard" && /* @__PURE__ */ jsxs(Stack, { space: 2, children: [
                    /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 2, padding: [0, 2], children: [
                      /* @__PURE__ */ jsx(
                        Checkbox,
                        {
                          id: `${id}--highest`,
                          style: { display: "block" },
                          checked: config.static_renditions.includes("highest"),
                          onChange: () => toggleRendition("highest")
                        }
                      ),
                      /* @__PURE__ */ jsx(Text, { as: "label", htmlFor: `${id}--highest`, children: "Highest Resolution (up to 4K)" })
                    ] }),
                    /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 2, padding: [0, 2], children: [
                      /* @__PURE__ */ jsx(
                        Checkbox,
                        {
                          id: `${id}--audio-only-standard`,
                          style: { display: "block" },
                          checked: config.static_renditions.includes("audio-only"),
                          onChange: () => toggleRendition("audio-only")
                        }
                      ),
                      /* @__PURE__ */ jsx(Text, { as: "label", htmlFor: `${id}--audio-only-standard`, children: "Audio Only (M4A)" })
                    ] })
                  ] }),
                  renditionMode === "advanced" && /* @__PURE__ */ jsxs(Stack, { space: 2, children: [
                    /* @__PURE__ */ jsx(Label$1, { size: 1, muted: !0, children: "Select specific resolutions:" }),
                    /* @__PURE__ */ jsx(Flex, { gap: 2, wrap: "wrap", children: ADVANCED_RESOLUTIONS.map(({ value, label }) => {
                      const inputId = `${id}--resolution-${value}`;
                      return /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 2, children: [
                        /* @__PURE__ */ jsx(
                          Checkbox,
                          {
                            id: inputId,
                            style: { display: "block" },
                            checked: config.static_renditions.includes(value),
                            onChange: () => toggleRendition(value)
                          }
                        ),
                        /* @__PURE__ */ jsx(Text, { as: "label", htmlFor: inputId, size: 1, children: label })
                      ] }, value);
                    }) }),
                    /* @__PURE__ */ jsxs(Flex, { align: "center", gap: 2, padding: [2, 2, 0, 2], children: [
                      /* @__PURE__ */ jsx(
                        Checkbox,
                        {
                          id: `${id}--audio-only-advanced`,
                          style: { display: "block" },
                          checked: config.static_renditions.includes("audio-only"),
                          onChange: () => toggleRendition("audio-only")
                        }
                      ),
                      /* @__PURE__ */ jsx(Text, { as: "label", htmlFor: `${id}--audio-only-advanced`, children: "Audio Only (M4A)" })
                    ] })
                  ] })
                ] })
              }
            ) })
          ] }) })
        ] }),
        !disableTextTrackConfig && !basicConfig && /* @__PURE__ */ jsx(
          TextTracksEditor,
          {
            tracks: config.text_tracks,
            dispatch,
            defaultLang: pluginConfig.defaultAutogeneratedSubtitleLang
          }
        ),
        /* @__PURE__ */ jsx(Box, { marginTop: 4, children: /* @__PURE__ */ jsx(
          Button,
          {
            disabled: !basicConfig && !config.public_policy && !config.signed_policy || validationError !== null || isLoadingDuration || isLoadingFileSize && !canSkipFileSizeValidation,
            icon: UploadIcon,
            text: "Upload",
            tone: "positive",
            onClick: () => {
              validationError || startUpload(formatUploadConfig(config), config.asset_name);
            }
          }
        ) })
      ] })
    }
  );
}
function setPlaybackPolicy(config) {
  const playback_policy = [];
  return config.public_policy && playback_policy.push("public"), config.signed_policy && playback_policy.push("signed"), playback_policy;
}
function formatUploadConfig(config) {
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
    playback_policy: setPlaybackPolicy(config),
    max_resolution_tier: config.max_resolution_tier,
    video_quality: config.video_quality,
    normalize_audio: config.normalize_audio
  };
}
function withFocusRing(component) {
  return styled(component)((props) => {
    const border = {
      width: props.$border ? 1 : 0,
      color: "var(--card-border-color)"
    };
    return css`
      --card-focus-box-shadow: ${focusRingBorderStyle(border)};

      border-radius: ${rem(props.theme.sanity.radius[1])};
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
const ctrlKey = 17, cmdKey = 91, UploadCardWithFocusRing = withFocusRing(Card), UploadCard = forwardRef(
  ({ children, tone, onPaste, onDrop, onDragEnter, onDragLeave, onDragOver }, forwardedRef) => {
    const ctrlDown = useRef(!1), inputRef = useRef(null), handleKeyDown = useCallback((event) => {
      (event.keyCode == ctrlKey || event.keyCode == cmdKey) && (ctrlDown.current = !0), ctrlDown.current && event.keyCode == 86 && inputRef.current.focus();
    }, []), handleKeyUp = useCallback((event) => {
      (event.keyCode == ctrlKey || event.keyCode == cmdKey) && (ctrlDown.current = !1);
    }, []);
    return /* @__PURE__ */ jsxs(
      UploadCardWithFocusRing,
      {
        tone,
        ref: forwardedRef,
        padding: 0,
        radius: 2,
        shadow: 0,
        tabIndex: 0,
        onKeyDown: handleKeyDown,
        onKeyUp: handleKeyUp,
        onPaste,
        onDrop,
        onDragEnter,
        onDragLeave,
        onDragOver,
        children: [
          /* @__PURE__ */ jsx(HiddenInput$1, { ref: inputRef, onPaste }),
          children
        ]
      }
    );
  }
), HiddenInput$1 = styled.input.attrs({ type: "text" })`
  position: absolute;
  border: 0;
  color: white;
  opacity: 0;

  &:focus {
    outline: none;
  }
`, HiddenInput = styled.input`
  overflow: hidden;
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  position: absolute;
  z-index: -1;
`, Label = styled.label`
  position: relative;
`, FileInputButton = ({ onSelect, accept, ...props }) => {
  const inputId = `FileSelect${useId()}`, inputRef = useRef(null), handleSelect = useCallback(
    (event) => {
      onSelect && onSelect(event.target.files);
    },
    [onSelect]
  ), handleButtonClick = useCallback(() => inputRef.current?.click(), []);
  return /* @__PURE__ */ jsxs(Label, { htmlFor: inputId, children: [
    /* @__PURE__ */ jsx(
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
    /* @__PURE__ */ jsx(
      Button,
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
  const { setDialogState, readOnly, onSelect, hovering, needsSetup, accept } = props, handleBrowse = useCallback(() => setDialogState("select-video"), [setDialogState]), handleConfigureApi = useCallback(() => setDialogState("secrets"), [setDialogState]), { hasConfigAccess } = useAccessControl(props.config);
  return /* @__PURE__ */ jsx(
    Card,
    {
      sizing: "border",
      tone: readOnly ? "transparent" : "inherit",
      border: !0,
      radius: 2,
      paddingX: 3,
      paddingY: 1,
      style: hovering ? { borderColor: "transparent" } : void 0,
      children: /* @__PURE__ */ jsxs(
        Flex,
        {
          align: "center",
          justify: "space-between",
          gap: 4,
          direction: ["column", "column", "row"],
          paddingY: 2,
          sizing: "border",
          children: [
            /* @__PURE__ */ jsxs(Flex, { align: "center", justify: "flex-start", gap: 2, flex: 1, children: [
              /* @__PURE__ */ jsx(Flex, { justify: "center", children: /* @__PURE__ */ jsx(Text, { muted: !0, children: /* @__PURE__ */ jsx(DocumentVideoIcon, {}) }) }),
              /* @__PURE__ */ jsx(Flex, { justify: "center", children: /* @__PURE__ */ jsxs(Text, { size: 1, muted: !0, children: [
                "Drag ",
                formatAcceptString(accept),
                " file or paste URL here"
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs(Inline, { space: 2, children: [
              /* @__PURE__ */ jsx(
                FileInputButton,
                {
                  accept,
                  mode: "bleed",
                  tone: "default",
                  icon: UploadIcon,
                  text: "Upload",
                  onSelect
                }
              ),
              /* @__PURE__ */ jsx(Button, { mode: "bleed", icon: SearchIcon, text: "Select", onClick: handleBrowse }),
              hasConfigAccess && /* @__PURE__ */ jsx(
                Button,
                {
                  padding: 3,
                  radius: 3,
                  tone: needsSetup ? "critical" : void 0,
                  onClick: handleConfigureApi,
                  icon: PlugIcon,
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
  const toast = useToast(), containerRef = useRef(null), dragEnteredEls = useRef([]), [dragState, setDragState] = useState(null), cancelUploadButton = useRef(
    (() => {
      const events$ = new Subject();
      return {
        observable: events$.asObservable(),
        handleClick: ((event) => events$.next(event))
      };
    })()
  ).current, uploadRef = useRef(null), uploadingDocumentId = useRef(null), [state, dispatch] = useReducer(
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
        case "error":
          return uploadRef.current?.unsubscribe(), uploadRef.current = null, uploadingDocumentId.current = null, Object.assign({}, INITIAL_STATE, { error: action.error });
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
  useEffect(() => {
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
          takeUntil(
            cancelUploadButton.observable.pipe(
              tap(() => {
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
            patches.push(setIfMissing({ asset: {}, _type: "mux.video" })), patches.push(set({ _type: "reference", _weak: !0, _ref: event.asset._id }, ["asset"])), props.config.inlineAssetMetadata && (patches.push(setIfMissing({ data: {} })), patches.push(set({ _type: "metadata", ...event.asset.data ?? {} }, ["data"]))), props.onChange(PatchEvent.from(patches)), props.config.inlineAssetMetadata && watchAssetForMetadata(event.asset._id, props);
            break;
        }
      },
      complete: () => dispatch({ action: "complete" }),
      error: (error) => dispatch({ action: "error", error })
    });
  }, invalidFileToast = useCallback(() => {
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
    const error = {};
    return /* @__PURE__ */ jsxs(Flex, { gap: 3, direction: "column", justify: "center", align: "center", children: [
      /* @__PURE__ */ jsx(Text, { size: 5, muted: !0, children: /* @__PURE__ */ jsx(ErrorOutlineIcon, {}) }),
      /* @__PURE__ */ jsx(Text, { children: "Something went wrong" }),
      error instanceof Error && error.message && /* @__PURE__ */ jsx(Text, { size: 1, muted: !0, children: error.message }),
      /* @__PURE__ */ jsx(Button, { text: "Upload another file", onClick: () => dispatch({ action: "reset" }) })
    ] });
  }
  if (state.uploadStatus !== null) {
    const { uploadStatus } = state;
    return /* @__PURE__ */ jsx(
      UploadProgress,
      {
        onCancel: cancelUploadButton.handleClick,
        progress: uploadStatus.progress,
        filename: uploadStatus.file?.name || uploadStatus.url
      }
    );
  }
  if (state.stagedUpload !== null)
    return /* @__PURE__ */ jsx(
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      UploadCard,
      {
        tone,
        onDrop: handleDrop,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDragEnter: handleDragEnter,
        onPaste: handlePaste,
        ref: containerRef,
        children: props.asset ? /* @__PURE__ */ jsx(
          DialogStateProvider,
          {
            dialogState: props.dialogState,
            setDialogState: props.setDialogState,
            children: /* @__PURE__ */ jsx(
              Player,
              {
                readOnly: props.readOnly,
                asset: props.asset,
                onChange: props.onChange,
                buttons: /* @__PURE__ */ jsx(
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
        ) : /* @__PURE__ */ jsx(
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
    props.dialogState === "select-video" && /* @__PURE__ */ jsx(
      InputBrowser,
      {
        asset: props.asset,
        onChange: props.onChange,
        setDialogState: props.setDialogState,
        config: props.config
      }
    )
  ] });
}
const Input = (props) => {
  const client = useClient(), secretDocumentValues = useSecretsDocumentValues(), assetDocumentValues = useAssetDocumentValues(props.value?.asset), poll = useMuxPolling(props.readOnly ? void 0 : assetDocumentValues?.value || void 0), [dialogState, setDialogState] = useDialogState(), { hasConfigAccess } = useAccessControl(props.config), error = secretDocumentValues.error || assetDocumentValues.error || poll.error;
  if (error)
    throw error;
  const isLoading = secretDocumentValues.isLoading || assetDocumentValues.isLoading;
  return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(ErrorBoundaryCard$1, { schemaType: props.schemaType, children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(InputFallback, {}), children: isLoading ? /* @__PURE__ */ jsx(InputFallback, {}) : /* @__PURE__ */ jsxs(Fragment, { children: [
    secretDocumentValues.value.needsSetup && !assetDocumentValues.value ? /* @__PURE__ */ jsx(Onboard, { setDialogState, config: props.config }) : /* @__PURE__ */ jsx(
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
    dialogState === "secrets" && hasConfigAccess && /* @__PURE__ */ jsx(
      ConfigureApiDialog,
      {
        setDialogState,
        secrets: secretDocumentValues.value.secrets
      }
    )
  ] }) }) }) });
};
var Input$1 = memo(Input);
function muxVideoCustomRendering(config) {
  return {
    components: {
      input: (props) => /* @__PURE__ */ jsx(Input$1, { config: { ...config, ...props.schemaType.options }, ...props })
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
          media: asset.playbackId ? /* @__PURE__ */ jsx(VideoThumbnail, { asset, width: 64 }) : null
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
    { type: "number", name: "max_height" }
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
  defaultPublic: !1,
  defaultSigned: !0,
  inlineAssetMetadata: !0,
  disableUploadConfig: !0,
  disableTextTrackConfig: !0,
  disableAssetNameConfig: !1,
  tool: DEFAULT_TOOL_CONFIG,
  allowedRolesForConfiguration: [],
  acceptedMimeTypes: ["video/*", "audio/*"]
};
function convertLegacyConfig(config) {
  return config.static_renditions && config.static_renditions.length > 0 ? { static_renditions: config.static_renditions } : config.mp4_support === "standard" ? { static_renditions: ["highest"] } : { static_renditions: [] };
}
const muxInput = definePlugin((userConfig) => {
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
export {
  defaultConfig,
  muxInput
};
//# sourceMappingURL=index.mjs.map
