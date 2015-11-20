from distutils.core import setup
import py2exe

setup(
    # The first three parameters are not required, if at least a
    # 'version' is given, then a versioninfo resource is built from
    # them and added to the executables.
    version = "1.0",
    name = "Simple HTTP Server",

    # targets to build
    console = [
		{
		"script": "python_server.py",
		}
		],
    )
