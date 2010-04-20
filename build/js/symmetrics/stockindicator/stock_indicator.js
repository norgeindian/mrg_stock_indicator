/**
 * Magento
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@magentocommerce.com so we can send you a copy immediately.
 *
 * @category  Symmetrics
 * @package   Symmetrics_StockIndicator
 * @author    symmetrics gmbh <info@symmetrics.de>
 * @author    Yauhen Yakimovich <yy@symmetrics.de>
 * @copyright 2010 symmetrics gmbh
 * @license   http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 * @link      http://www.symmetrics.de/
 */

/**
 * Stock indicator for configurable product
 *
 * @category  Symmetrics
 * @package   Symmetrics_StockIndicator
 * @author    symmetrics gmbh <info@symmetrics.de>
 * @author    Yauhen Yakimovich <yy@symmetrics.de>
 * @copyright 2010 symmetrics gmbh
 * @license   http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 * @link      http://www.symmetrics.de/
 */

if (!window.Symmetrics) {
    window.Symmetrics = {};
}

if (!Symmetrics.Product) {
    Symmetrics.Product = {};
}

Symmetrics.Product.StockIndicatorConfig = Class.create();
Symmetrics.Product.StockIndicatorConfig.prototype = {
    /* @const wrapper selector */
    STOCK_INDICATOR_SELECTOR: 'div .stock-indicator-wrapper .stock-indicator',

    /* @const red state */
    RED_STATE: 'red',

    /* @const yellow state */
    YELLOW_STATE: 'yellow',

    /* @const green state */
    GREEN_STATE: 'green',

    /**
     * Constructor
     */
    initialize: function(spConfig, productQuantities,
        redConfig, yellowConfig, greenConfig){
        this.indicator = null;
        this.spConfig = spConfig;
        /* @var productQuantities array of simple product quantites associated
         *                        with current configurable for which stock
         *                        indicator is displayed
         */
        this.productQuantities = productQuantities;
        /* @var configQuantities configuration of the state quantites */
        this.configQuantities = {};
        this.configQuantities[this.RED_STATE] = redConfig.quantity;
        this.configQuantities[this.YELLOW_STATE] = yellowConfig.quantity;
        this.configQuantities[this.GREEN_STATE] = greenConfig.quantity;
        /* @var configTitles configuration of the state titles */
        this.configTitles = {};
        this.configTitles[this.RED_STATE] = redConfig.title;
        this.configTitles[this.YELLOW_STATE] = yellowConfig.title;
        this.configTitles[this.GREEN_STATE] = greenConfig.title;
        /* @var currentState current state value after latest update  */
        this.currentState = null;
        var fullQuantity = this.getAllProductsQuantity();
        this.updateIndicatorStateByQuantity(fullQuantity);

        this.observeOptionDropdowns();
    },

    /**
     * Get indicator states
     *
     * @return list of states
     */
    getIndicatorStates: function(){
        return [this.RED_STATE, this.YELLOW_STATE, this.GREEN_STATE];
    },

    /**
     * Get indicator element from the DOM
     *
     * @return element
     */
    getIndicator: function(){
        if (!this.indicator) {
            var selector = this.STOCK_INDICATOR_SELECTOR;
            this.indicator = $$(selector)[0];
        }
        return this.indicator;
    },


    /**
     * Update state of the indicator in the DOM
     *
     * @return Symmetrics.Product.StockIndicatorConfig
     */
    updateIndicatorState: function(state){
        if (this.currentState == state) {
            // no new changes will be introduced; ignore
            return this;
        }
        // update latest state value
        this.currentState = state;
        // update state by changing css classname and updating title
        switch (state) {
            case this.GREEN_STATE:
            case this.YELLOW_STATE:
                this.clearIndicatorState().getIndicator().addClassName(state);                
                break;
            case this.RED_STATE:
                this.clearIndicatorState();
                break;
        }
        Element.writeAttribute(this.getIndicator(), 'title', this.configTitles[state]);

        return this;
    },

    /**
     * Clear previous states of the indicator in the DOM
     *
     * @return Symmetrics.Product.StockIndicatorConfig
     */
    clearIndicatorState: function(){
        var cssStateClassnames = ['red', 'yellow', 'green'];
        cssStateClassnames.each(function(state){        
            if (this.getIndicator().hasClassName(state)){                
                this.getIndicator().removeClassName(state);
            }
        }.bind(this));

        return this;
    },

    /**
     * Set indicator to RED
     */
    setRedState: function(){
        this.updateIndicatorState(this.RED_STATE);
    },

    /**
     * Set indicator to YELLOW
     */
    setYellowState: function(){
        this.updateIndicatorState(this.YELLOW_STATE);
    },

    /**
     * Set indicator to GREEN
     */
    setGreenState: function(){
        this.updateIndicatorState(this.GREEN_STATE);
    },

    /**
     * Get last dropdown element used to selecet configurable product option
     *
     * @return element
     */
    getLastDropdown: function(){
        return this.spConfig.settings.last();
    },

    /**
     * Observe options selection by user, so that we know when
     * we have the simple product
     */
    observeOptionDropdowns: function(){
        // observe each option dropdown
        var optionDropdowns = spConfig.settings;
        optionDropdowns.each(function(dropdown){
            dropdown.observe('change', this.updateOnChange.bind(this));
        }.bind(this));
    },

    /**
     * Determinate the product, compute the state and update it
     *
     * @param event Prototype Event argument
     */
    updateOnChange: function(event){
        // take dropdown
        var dropdown = event.target;

        // build a list of product ids
        var productIds = this.getSelectedProductIds(dropdown);

        // sum quantities of selected products
        var quantity = 0;
        var quantities = productIds.collect(function(productId){
            return this.getProductQuantity(productId);
        }.bind(this)).toArray();
        for (var index = 0, len = quantities.length; index < len; ++index) {
            quantity += quantities[index];
        }

        // update state
        this.updateIndicatorStateByQuantity(quantity);
    },

    /**
     * Get quantity of all products
     *
     * @return int
     */
    getAllProductsQuantity: function(){
        var quantity = 0;
        var quantities = Object.values(this.productQuantities);
        for (var index = 0, len = quantities.length; index < len; ++index) {
            quantity += quantities[index];
        }

        return quantity;
    },

    /**
     * Update indicator state by quantity
     *
     * @param quantity int
     */
    updateIndicatorStateByQuantity: function(quantity){
        this.getIndicatorStates().each(function(quantity, state){
            if (quantity >= this.getConfigQuantity(state)) {
                this.updateIndicatorState(state);
            }
        }.bind(this, quantity));
    },

    /**
     * Get selected product ids from dropdown
     *
     * @return array of product ids
     */
    getSelectedProductIds: function(dropdown){
        var index = dropdown.options.selectedIndex;
        if (dropdown.options[index].config == undefined) {
            return $A(); // empty list
        }
        var productIds = dropdown.options[index].config.products;

        return productIds;
    },
    
    /**
     * Get product quantity by product id
     *
     * @param productId product id
     *
     * @return int product quantity
     */
    getProductQuantity: function(productId){
        var quantity = this.productQuantities[productId];
        return quantity;
    },

    /**
     * Get configured quantity by state
     *
     * @param state product state
     *
     * @return int configured product quantity
     */
    getConfigQuantity: function(state){
        var quantity = this.configQuantities[state];
        return quantity;
    }
}
