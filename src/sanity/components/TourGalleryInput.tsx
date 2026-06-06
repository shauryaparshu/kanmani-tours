import { useRef, useState, type ChangeEvent } from 'react'
import { UploadIcon } from '@sanity/icons'
import { Button, Card, Stack, Text } from '@sanity/ui'
import { set, type ArrayOfObjectsInputProps } from 'sanity'

type GalleryImageValue = {
    _type: 'image'
    _key: string
    asset: {
        _type: 'reference'
        _ref: string
    }
}

function createKey() {
    return globalThis.crypto?.randomUUID?.() ?? `key_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export default function TourGalleryInput(props: ArrayOfObjectsInputProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.currentTarget.files ?? []).filter(file => file.type.startsWith('image/'))
        event.currentTarget.value = ''

        if (files.length === 0) return

        setIsUploading(true)
        setError(null)

        try {
            const nextItems: GalleryImageValue[] = []
            const failedFiles: string[] = []

            // Upload one file at a time so a large batch does not fail as a single
            // concurrent request burst, and so one bad file does not block the rest.
            for (const file of files) {
                try {
                    const asset = await props.client.assets.upload('image', file, { filename: file.name })
                    nextItems.push({
                        _type: 'image',
                        _key: createKey(),
                        asset: {
                            _type: 'reference',
                            _ref: asset._id,
                        },
                    })
                } catch (fileError) {
                    failedFiles.push(file.name)
                    console.error('Failed to upload gallery image:', file.name, fileError)
                }
            }

            if (nextItems.length > 0) {
                props.onChange(set([...(props.value ?? []), ...nextItems]))
            }

            if (failedFiles.length > 0) {
                const failedLabel = failedFiles.length === 1 ? failedFiles[0] : `${failedFiles.length} files`
                setError(
                    nextItems.length > 0
                        ? `Uploaded ${nextItems.length} photo${nextItems.length === 1 ? '' : 's'}, but ${failedLabel} failed.`
                        : `Unable to upload ${failedLabel}.`
                )
            }
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : 'Unable to upload selected images.')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <Stack space={3}>
            <Card border padding={3} radius={2}>
                <Stack space={3}>
                    <Button
                        icon={UploadIcon}
                        tone="primary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Upload local photos'}
                    </Button>
                    <Text size={1} muted>
                        Choose multiple photos from your device. They will be added to this gallery and stay draggable in the array below.
                    </Text>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={handleFileChange}
                    />
                    {error && (
                        <Text size={1} tone="critical">
                            {error}
                        </Text>
                    )}
                </Stack>
            </Card>

            {props.renderDefault(props)}
        </Stack>
    )
}
