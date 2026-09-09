"""
tflite_runtime compatibility package for XORON Edge AI.
Maps directly to Google's official ai-edge-litert runtime.
"""
try:
    import ai_edge_litert as _backend
except ImportError:
    _backend = None

__version__ = getattr(_backend, "__version__", "2.2.0")
