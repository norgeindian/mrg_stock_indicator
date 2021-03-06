# encoding: utf-8


# =============================================================================
# package info
# =============================================================================
NAME = 'symmetrics_module_stock_indicator'

TAGS = ('magento', 'symmetrics', 'module', 'stock', 'indicator', 'mrg')

LICENSE = 'AFL 3.0'

HOMEPAGE = 'http://www.symmetrics.de'

INSTALL_PATH = ''


# =============================================================================
# responsibilities
# =============================================================================
TEAM_LEADER = {
    'Torsten Walluhn': 'tw@symmetrics.de',
}

MAINTAINER = {
    'Andreas Timm': 'at@symmetrics.de',
}

AUTHORS = {
    'Andreas Timm': 'at@symmetrics.de',
    'Ngoc Anh Doan': 'nd@symmetrics.de',
    'Torsten Walluhn': 'tw@symmetrics.de',
    'Yauhen Yakimovich': 'yy@symmetrics.de',
    'Eric Reiche': 'er@symmetrics.de',
}

# =============================================================================
# additional infos
# =============================================================================
INFO = 'Ampel für Lagerbestand'

SUMMARY = '''
    Zeigt eine 3-farbige Ampel. Die Einstellungen dafür findet man unter
    Admin Panel/System/Configuration/Inventory/Stock Indicator.
'''

NOTES = '''
'''

# =============================================================================
# relations
# =============================================================================
REQUIRES = [
    {'magento': '*', 'magento_enterprise': '*'},
]

EXCLUDES = {}

DEPENDS_ON_FILES = (
    'app/code/core/Mage/Catalog/Block/Product/Abstract.php',
)

PEAR_KEY = ''

COMPATIBLE_WITH = {
    'magento': ['1.4.0.0', '1.4.0.1', '1.4.1.0', '1.4.1.1'],
    'magento_enterprise': ['1.7.0.0', '1.7.1.0', '1.8.0.0', '1.9.0.0'],
}
