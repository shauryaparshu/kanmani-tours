import { useRef, useState, type ChangeEvent, type DragEvent, type MouseEvent } from 'react'
import { UploadIcon } from '@sanity/icons'
import { Card, Stack, Text } from '@sanity/ui'
import { set, type ArrayOfObjectsInputProps, useClient } from 'sanity'

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
    const [isDragging, setIsDragging] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const client = useClient({ apiVersion: '2024-01-01' })

    const uploadFiles = async (files: File[]) => {
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
                    const asset = await client.assets.upload('image', file, { filename: file.name })
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

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.currentTarget.files ?? []).filter(file => file.type.startsWith('image/'))
        event.currentTarget.value = ''
        await uploadFiles(files)
    }

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        if (!isUploading) {
            setIsDragging(true)
        }
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        setIsDragging(false)
        if (isUploading) return

        const files = Array.from(event.dataTransfer.files).filter(file => file.type.startsWith('image/'))
        await uploadFiles(files)
    }

    const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
        if (!isUploading) {
            fileInputRef.current?.click()
        }
    }

    return (
        <Stack space={3}>
            <Card
                border
                padding={4}
                radius={2}
                tone={isDragging ? 'primary' : 'default'}
                style={{
                    borderStyle: 'dashed',
                    transition: 'all 0.15s ease-in-out',
                    cursor: isUploading ? 'not-allowed' : 'pointer',
                    opacity: isUploading ? 0.7 : 1,
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleCardClick}
            >
                <Stack space={3} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', opacity: 0.6 }}>
                        <UploadIcon />
                    </div>
                    <Text size={2} weight="bold">
                        {isDragging ? 'Drop your photos here!' : 'Drag & drop photos here'}
                    </Text>
                    <Text size={1} muted>
                        {isUploading ? 'Uploading files, please wait...' : 'or click here to browse and select multiple files'}
                    </Text>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                    {error && (
                        <Card tone="critical" padding={2} radius={2} style={{ width: '100%', marginTop: '8px' }}>
                            <Text size={1} align="center">
                                {error}
                            </Text>
                        </Card>
                    )}
                </Stack>
            </Card>

            {props.renderDefault(props)}
        </Stack>
    )
}
