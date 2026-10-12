import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Unmount anything rendered by the previous test so hooks don't leak.
afterEach(() => {
    cleanup()
})