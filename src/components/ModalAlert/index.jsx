import React from 'react'

function ModalAlert({ title, message, cancelText, confirmText, onCancel, onConfirm, confirmHref }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#000000A8] z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                {title && (
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                )}
                {message && (
                    <p className="text-md text-gray-500 my-4">{message}</p>
                )}
                <div className="flex justify-end gap-3">
                    {cancelText && (
                        <button
                            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                            onClick={onCancel}
                        >
                            {cancelText}
                        </button>
                    )}
                    {confirmText && (
                        confirmHref ? (
                            <a
                                href={confirmHref}
                                className="px-4 py-2 rounded font-semibold bg-[#13b2a0] text-white hover:bg-[#0f7871]"
                            >
                                {confirmText}
                            </a>
                        ) : (
                            <button
                                className="px-4 py-2 rounded font-semibold bg-[#13b2a0] text-white hover:bg-[#0f7871]"
                                onClick={onConfirm}
                            >
                                {confirmText}
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export { ModalAlert }