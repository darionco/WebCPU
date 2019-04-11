#include <emscripten.h>
#include <math.h>

extern float now();

typedef struct {
    int iterations;
    int value;
    float elapsed;
} Result;

void EMSCRIPTEN_KEEPALIVE runWorkload_old(int duration, Result *result)
{
    int a = 0x08a90db3;
    int b = 0xabd209a0;
    int c = 0x29019b32;
    int d = 0x01ab3291;
    int i;

    float start = now();
    float end = start;

    for (i = 0; end - start < duration; ++i, end = now()) {
        a = (b ^ a) >> 1;
        b = (c ^ b) << 1;
        c = (d ^ c) >> 1;
        d = (a ^ d) << 1;
    }

    result->iterations = i;
    result->elapsed = end - start;
    result->value = a;
}

void EMSCRIPTEN_KEEPALIVE runWorkload(int duration, Result *result)
{
    float creal = -0.8;
    float cimag = 0.156;

    int frame = 0;

    int y;
    int x;
    int i;
    int ii;

    float cx;
    float cy;
    float xt;

    float start = now();
    float end = start;

    for (ii = 0; end - start < duration; ++ii, end = now()) {
        for(y = 0; y < 200; ++y)
        {
            for(x = 0; x < 200; ++x)
            {
                cx = -2 + x / 50;
                cy = -2 + y / 50;
                i = 0;

                do
                {
                    xt = cx * cx - cy * cy + creal;
                    cy = 2 * cx * cy + cimag;
                    cx = xt;
                }
                while ((cx * cx + cy * cy < 4) && ++i < 25);
            }
        }
        ++frame;        // increase the number of the frame
        creal= -0.8 + 0.6 * sin(frame / (M_PI * 20));    // calculate the new coordinates
        cimag= 0.156 + 0.4 * cos(frame / (M_PI * 40));   // of the c point
    }

    result->iterations = frame;
    result->elapsed = end - start;
    result->value = xt;
}
