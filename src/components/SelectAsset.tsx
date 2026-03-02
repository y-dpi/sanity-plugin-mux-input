import {useCallback} from 'react'
import {PatchEvent, set, setIfMissing, unset} from 'sanity'

import type {SetDialogState} from '../hooks/useDialogState'
import type {MuxInputProps, PluginConfig, VideoAssetDocument} from '../util/types'
import VideosBrowser, {type VideosBrowserProps} from './VideosBrowser'

export interface Props extends Pick<MuxInputProps, 'onChange'> {
  asset?: VideoAssetDocument | null | undefined
  setDialogState: SetDialogState
  config: PluginConfig
}

export default function SelectAssets({
  asset: selectedAsset,
  onChange,
  setDialogState,
  config,
}: Props) {
  const handleSelect = useCallback<Required<VideosBrowserProps>['onSelect']>(
    (chosenAsset) => {
      if (!chosenAsset?._id) {
        onChange(PatchEvent.from([unset(['asset'])]))
      }
      if (chosenAsset._id !== selectedAsset?._id) {
        const patches = []
        patches.push(setIfMissing({asset: {}, _type: 'mux.video'}))
        patches.push(set({_type: 'reference', _weak: true, _ref: chosenAsset._id}, ['asset']))
        if (config.inlineAssetMetadata) {
          patches.push(setIfMissing({data: {}}))
          patches.push(set({_type: 'metadata', ...(chosenAsset.data ?? {})}, ['data']))
        }
        onChange(PatchEvent.from(patches))
      }
      setDialogState(false)
    },
    [onChange, setDialogState, selectedAsset]
  )

  return <VideosBrowser onSelect={handleSelect} config={config} />
}
