import { ImageResponse } from 'next/og';

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: '#f8fafc',
                    color: '#020617',
                    padding: '72px 80px',
                    fontFamily: 'Arial, sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        width: 560,
                        height: 560,
                        borderRadius: 999,
                        background: '#d1fae5',
                        top: -280,
                        right: -80,
                    }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
                    <div
                        style={{
                            width: 54,
                            height: 54,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 14,
                            background: '#020617',
                            color: 'white',
                            fontSize: 27,
                            fontWeight: 900,
                        }}
                    >
                        F
                    </div>
                    <div style={{ display: 'flex', fontSize: 34, fontWeight: 900, letterSpacing: -1.5 }}>
                        FixCode<span style={{ color: '#059669' }}>DB</span>
                    </div>
                </div>

                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', maxWidth: 900 }}>
                    <div style={{ fontSize: 64, lineHeight: 1.03, letterSpacing: -3.4, fontWeight: 900 }}>
                        Your search engine for appliance problems.
                    </div>
                    <div style={{ marginTop: 26, fontSize: 26, lineHeight: 1.35, color: '#475569', fontWeight: 500 }}>
                        Error codes · likely causes · diagnostic steps · model-fit part guidance
                    </div>
                </div>

                <div style={{ position: 'relative', display: 'flex', fontSize: 18, fontWeight: 700, color: '#047857' }}>
                    fixcodedb.com
                </div>
            </div>
        ),
        size,
    );
}
