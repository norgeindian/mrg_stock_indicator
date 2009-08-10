<?php
/**
 * @category Symmetrics
 * @package Symmetrics_StockIndicator
 * @author symmetrics gmbh <info@symmetrics.de>, Andreas Timm <at@symmetrics.de>
 * @copyright symmetrics gmbh
 * @license http://opensource.org/licenses/osl-3.0.php  Open Software 
 */
require_once('app/code/local/Symmetrics/StockIndicator/Block/StaticIndicator.php');
/*
 * This class extends the Block class for product view and calls the static class to get the Trafficlight color
 */
class Symmetrics_StockIndicator_Block_Indicator extends Mage_Catalog_Block_Product_View
{
	
	protected $productId;

    public function getAvailabilityClass()
    {
    	if(!isset($this->productId)) {
    		return StaticIndicator::getColor($this->getProduct());
        }
        else {
    		return StaticIndicator::getColor($this->productId);
        }
    }
    
    function setProductIdAvail($productId)
    {
    	$this->productId = $productId;
    }
}