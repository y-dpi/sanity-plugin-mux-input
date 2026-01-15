// Sanity.
import {PatchEvent, set} from 'sanity'
import type {SanityClient} from 'sanity'

// Hooks.
import {type DialogState, type SetDialogState} from '../hooks/useDialogState'

// Utils.
import type {
  MuxInputProps,
  PluginConfig,
  Secrets,
  VideoAssetDocument,
} from './types'

// Props definition (derived from Uploader.tsx)
interface Props extends Pick<MuxInputProps, 'onChange' | 'readOnly'> {
  config: PluginConfig
  client: SanityClient
  secrets: Secrets
  asset: VideoAssetDocument | null | undefined
  dialogState: DialogState
  setDialogState: SetDialogState
  needsSetup: boolean
}

/**
 * Watch when a Mux asset enters a 'ready' state on Sanity
 * and update the metadata field in the provided Sanity document.
 * 
 * @param assetId Sanity ID of the Mux asset to be watched.
 * @param props Props of the Sanity document to be edited on update.
 */
export const watchAssetForMetadata = (assetId: string, props: Props) => {
  const subscription = props.client
    .listen(
      `*[_id == $id]`,
      {id: assetId},
      {includeResult: true}
    )
    .subscribe((event) => {
      if (event.type !== "mutation") return

      const asset = event.result as VideoAssetDocument | null
      const data = asset?.data
      const status = asset?.status

      if (!data) return
      if (status !== "ready") return

      props.onChange(
        PatchEvent.from([
          set({_type: "metadata", ...data}, ["data"]),
        ])
      )

      subscription.unsubscribe()
    })
}