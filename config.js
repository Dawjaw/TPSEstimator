import {@Vigilant, @SliderProperty, @SwitchProperty, @ButtonProperty, @NumberProperty,} from '../Vigilance';

@Vigilant("TPSEstimator")
class Settings {

    @SwitchProperty({
        name: "GUI",
        description: "Enables/Disbles the GUI",
        category: "General",
        subcategory: "GUI",
    })
    guiToggle = true;

    @ButtonProperty({
        name: 'Move GUI',
        description: 'Move the GUI around',
        category: 'General',
        subcategory: 'GUI',
        placeholder: 'Click!',
    })
    myButtonAction() {
        tpsestimator.tpsgui.open();
    }

    @SliderProperty({
        name: "Buffer size",
        description: "Over how many values the TPS is averaged over",
        category: "General",
        subcategory: "Data",
        min: 1,
        max: 300
    })
    tpsSlider = 60;

    @NumberProperty({
        name: "X",
        category: "General",
        subcategory: 'GUI',
        hidden: true
    })
    x = 50;

    @NumberProperty({
        name: "y",
        category: "General",
        subcategory: 'GUI',
        hidden: true
    })
    y = 50;

    constructor() {
        this.initialize(this);
        this.setCategoryDescription("General", "Settings", "Made by Dawjaw")
        this.setSubcategoryDescription("General", "GUI", "")
        this.setSubcategoryDescription("General", "Data", "")
    }
}

export const tpsestimator = {};
export default new Settings;
