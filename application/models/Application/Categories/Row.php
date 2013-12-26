<?php
/**
 * @namespace
 */
namespace Application\Categories;

class Row extends \Bluz\Db\Row
{
    /**
     * Small cache of user privileges
     * @var array
     */
    protected $privileges;

    /**
     * @return void
     */
    public function beforeInsert()
    {
        $this->created = gmdate('Y-m-d H:i:s');
    }

    /**
     * @return void
     */

    public function beforeUpdate()
    {
        $this->updated = gmdate('Y-m-d H:i:s');
    }

}
