import logging
import os
from logging.handlers import RotatingFileHandler

# Define log file parameters
LOG_DIR = "logs"
LOG_FILE = os.path.join(LOG_DIR, "erp_app.log")

# Guarantee logs directory exists
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

# Configure logger formatting layout
LOG_FORMAT = "[%(asctime)s] [%(levelname)s] [%(filename)s:%(lineno)d] - %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

# Create root logger
logger = logging.getLogger("erp_logger")
logger.setLevel(logging.INFO)

# Avoid adding duplicate handlers if logger is already configured
if not logger.handlers:
    # 1. Console Stream Handler (Development stdout)
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(logging.Formatter(LOG_FORMAT, datefmt=DATE_FORMAT))
    logger.addHandler(console_handler)

    # 2. Rotating File Handler (Production persistent diagnostics)
    file_handler = RotatingFileHandler(
        LOG_FILE,
        maxBytes=10 * 1024 * 1024,  # 10 Megabytes limit
        backupCount=5               # Keep up to 5 historical rotating logs
    )
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(logging.Formatter(LOG_FORMAT, datefmt=DATE_FORMAT))
    logger.addHandler(file_handler)
